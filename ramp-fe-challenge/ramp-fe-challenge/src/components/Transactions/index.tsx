import { useCallback } from "react"
import { useCustomFetch } from "src/hooks/useCustomFetch"
import { SetTransactionApprovalParams } from "src/utils/types"
import { TransactionPane } from "./TransactionPane"
import { SetTransactionApprovalFunction, TransactionsComponent } from "./types"

export const Transactions: TransactionsComponent = ({ transactions }) => {
  const { fetchWithoutCache, loading } = useCustomFetch()
  const [allTransactions, setAllTransactions] = useState(transactions)

  const setTransactionApproval = useCallback<SetTransactionApprovalFunction>(
    async ({ transactionId, newValue }) => {
      await fetchWithoutCache<void, SetTransactionApprovalParams>("setTransactionApproval", {
        transactionId,
        value: newValue,
      })
    },
    [fetchWithoutCache]
  )
  /*added 21-24. The loadMoreTransactions function is defined using useCallback and is responsible for fetching more transactions and appending them to the existing allTransactions state.*/
  const loadMoreTransactions = useCallback(async () => {
    const newTransactions = await fetchWithoutCache<Transaction[]>("getMoreTransactions")
    setAllTransactions((prevTransactions) => [...prevTransactions, ...newTransactions])
  }, [fetchWithoutCache])

  if (transactions === null) {
    return <div className="RampLoading--container">Loading...</div>
  }

/*The allTransactions state is used in the mapping of the TransactionPane components to ensure that all transactions, including the newly loaded ones, are rendered correctly.*/
  return (
    <div data-testid="transaction-container">
      {allTransactions.map((transaction) => (
        <TransactionPane
          key={transaction.id}
          transaction={transaction}
          loading={loading}
          setTransactionApproval={setTransactionApproval}
        />
        /*added line 41. The "View more" button is added and the loadMoreTransactions function is attached to its onClick event handler.*/
      ))}
      <button onClick={loadMoreTransactions}>View more</button> 
    </div>
  )
}
