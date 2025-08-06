import React, { useState, useEffect } from 'react'
import { useAuthStore } from '../../store/auth-store'
import { supabase } from '../../lib/supabase'
import { Coins, Plus, Minus, History, ShoppingCart } from 'lucide-react'

interface CreditTransaction {
  id: string
  amount: number
  description: string
  transaction_type: 'purchase' | 'usage' | 'bonus' | 'refund'
  created_at: string
}

export const CreditsManager: React.FC = () => {
  const { user, profile, updateCredits } = useAuthStore()
  const [transactions, setTransactions] = useState<CreditTransaction[]>([])
  const [loading, setLoading] = useState(false)
  const [showHistory, setShowHistory] = useState(false)
  const [customAmount, setCustomAmount] = useState('')
  const [customDescription, setCustomDescription] = useState('')

  useEffect(() => {
    if (showHistory) {
      loadTransactions()
    }
  }, [showHistory])

  const loadTransactions = async () => {
    if (!user) return

    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('credits_transactions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(50)

      if (error) {
        console.error('Error loading transactions:', error)
        return
      }

      setTransactions(data || [])
    } catch (error) {
      console.error('Error loading transactions:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddCredits = async (amount: number, description: string, type: 'purchase' | 'bonus' = 'purchase') => {
    if (!user) return

    try {
      setLoading(true)
      
      // Add transaction record
      const { error: transactionError } = await supabase
        .from('credits_transactions')
        .insert({
          user_id: user.id,
          amount,
          description,
          transaction_type: type
        })

      if (transactionError) {
        alert('Error recording transaction: ' + transactionError.message)
        return
      }

      // Update user credits
      const result = await updateCredits(amount)
      
      if (result.success) {
        alert(`Successfully added ${amount} credits!`)
        if (showHistory) {
          loadTransactions()
        }
      } else {
        alert('Error updating credits: ' + result.error)
      }
    } catch (error) {
      console.error('Error adding credits:', error)
      alert('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleUseCredits = async (amount: number, description: string) => {
    if (!user || !profile) return

    if (profile.credits < amount) {
      alert('Insufficient credits!')
      return
    }

    try {
      setLoading(true)
      
      // Add transaction record
      const { error: transactionError } = await supabase
        .from('credits_transactions')
        .insert({
          user_id: user.id,
          amount: -amount,
          description,
          transaction_type: 'usage'
        })

      if (transactionError) {
        alert('Error recording transaction: ' + transactionError.message)
        return
      }

      // Update user credits
      const result = await updateCredits(-amount)
      
      if (result.success) {
        alert(`Successfully used ${amount} credits!`)
        if (showHistory) {
          loadTransactions()
        }
      } else {
        alert('Error updating credits: ' + result.error)
      }
    } catch (error) {
      console.error('Error using credits:', error)
      alert('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleCustomTransaction = async () => {
    const amount = parseInt(customAmount)
    if (!amount || !customDescription.trim()) {
      alert('Please enter a valid amount and description')
      return
    }

    if (amount > 0) {
      await handleAddCredits(amount, customDescription, 'bonus')
    } else {
      await handleUseCredits(Math.abs(amount), customDescription)
    }

    setCustomAmount('')
    setCustomDescription('')
  }

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'purchase':
        return <ShoppingCart className="w-4 h-4 text-green-500" />
      case 'bonus':
        return <Plus className="w-4 h-4 text-blue-500" />
      case 'usage':
        return <Minus className="w-4 h-4 text-red-500" />
      case 'refund':
        return <Plus className="w-4 h-4 text-yellow-500" />
      default:
        return <Coins className="w-4 h-4 text-gray-500" />
    }
  }

  const getTransactionColor = (amount: number) => {
    return amount > 0 ? 'text-green-600' : 'text-red-600'
  }

  if (!profile) {
    return <div>Loading...</div>
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-[#9C83FF] to-[#FF9051] bg-clip-text text-transparent">
            Credits Management
          </h2>
          <div className="flex items-center gap-2 bg-gradient-to-r from-[#9C83FF] to-[#FF9051] text-white px-4 py-2 rounded-lg">
            <Coins className="w-5 h-5" />
            <span className="text-xl font-bold">{profile.credits} Credits</span>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <h3 className="font-semibold mb-3 text-gray-900 dark:text-white">Quick Add Credits</h3>
            <div className="space-y-2">
              <button
                onClick={() => handleAddCredits(50, 'Quick add 50 credits')}
                disabled={loading}
                className="w-full bg-green-500 text-white py-2 px-4 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                +50 Credits
              </button>
              <button
                onClick={() => handleAddCredits(100, 'Quick add 100 credits')}
                disabled={loading}
                className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                +100 Credits
              </button>
              <button
                onClick={() => handleAddCredits(500, 'Quick add 500 credits')}
                disabled={loading}
                className="w-full bg-green-700 text-white py-2 px-4 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                +500 Credits
              </button>
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <h3 className="font-semibold mb-3 text-gray-900 dark:text-white">Test Usage</h3>
            <div className="space-y-2">
              <button
                onClick={() => handleUseCredits(1, 'Test scraping task')}
                disabled={loading || profile.credits < 1}
                className="w-full bg-red-500 text-white py-2 px-4 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                Use 1 Credit
              </button>
              <button
                onClick={() => handleUseCredits(5, 'Medium scraping task')}
                disabled={loading || profile.credits < 5}
                className="w-full bg-red-600 text-white py-2 px-4 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                Use 5 Credits
              </button>
              <button
                onClick={() => handleUseCredits(10, 'Large scraping task')}
                disabled={loading || profile.credits < 10}
                className="w-full bg-red-700 text-white py-2 px-4 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                Use 10 Credits
              </button>
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <h3 className="font-semibold mb-3 text-gray-900 dark:text-white">Custom Transaction</h3>
            <div className="space-y-2">
              <input
                type="number"
                placeholder="Amount (+/-)"
                value={customAmount}
                onChange={(e) => setCustomAmount(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-[#9C83FF] focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
              />
              <input
                type="text"
                placeholder="Description"
                value={customDescription}
                onChange={(e) => setCustomDescription(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-[#9C83FF] focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
              />
              <button
                onClick={handleCustomTransaction}
                disabled={loading || !customAmount || !customDescription.trim()}
                className="w-full bg-[#9C83FF] text-white py-2 px-4 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 text-sm"
              >
                Execute
              </button>
            </div>
          </div>
        </div>

        {/* Transaction History */}
        <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Transaction History
            </h3>
            <button
              onClick={() => setShowHistory(!showHistory)}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              <History className="w-4 h-4" />
              {showHistory ? 'Hide History' : 'Show History'}
            </button>
          </div>

          {showHistory && (
            <div className="space-y-2">
              {loading ? (
                <div className="text-center py-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#9C83FF] mx-auto"></div>
                </div>
              ) : transactions.length === 0 ? (
                <div className="text-center py-4 text-gray-500">
                  No transactions found
                </div>
              ) : (
                <div className="max-h-96 overflow-y-auto">
                  {transactions.map((transaction) => (
                    <div
                      key={transaction.id}
                      className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        {getTransactionIcon(transaction.transaction_type)}
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {transaction.description}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {new Date(transaction.created_at).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`font-bold ${getTransactionColor(transaction.amount)}`}>
                          {transaction.amount > 0 ? '+' : ''}{transaction.amount}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                          {transaction.transaction_type}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}