
interface WalletBalance {
  currency: string;
  amount: number;
}
interface FormattedWalletBalance {
  currency: string;
  amount: number;
  formatted: string;
}

interface Props extends BoxProps {

}
const WalletPage: React.FC<Props> = (props: Props) => {
  const { children, ...rest } = props;
  const balances = useWalletBalances();
  const prices = usePrices();

	const getPriority = (blockchain: any): number => {
	  switch (blockchain) {
	    case 'Osmosis':
	      return 100
	    case 'Ethereum':
	      return 50
	    case 'Arbitrum':
	      return 30
	    case 'Zilliqa':
	      return 20
	    case 'Neo':
	      return 20
	    default:
	      return -99
	  }
	}
/*
  const sortedBalances = useMemo(() => {
    return balances.filter((balance: WalletBalance) => {
		  const balancePriority = getPriority(balance.blockchain);
		  if (lhsPriority > -99) {
		     if (balance.amount <= 0) {
		       return true;
		     }
		  }
		  return false
		}).sort((lhs: WalletBalance, rhs: WalletBalance) => {
			const leftPriority = getPriority(lhs.blockchain);
		  const rightPriority = getPriority(rhs.blockchain);
		  if (leftPriority > rightPriority) {
		    return -1;
		  } else if (rightPriority > leftPriority) {
		    return 1;
		  }
    });
  }, [balances, prices]);
*/
  
  /*
    The above code has some points:
1. The variable is not defined (lhsPriority) => replace it with balancePriority because it has been calculated before.
2. The code uses .filter() first and then .sort(), causing the balances array to be scanned twice, wasting resources => use .reduce() or do it in the same .sort()
3. Dependency [balances, prices] is not necessible: prices do not affect sortedBalances, so there is no need to include it in the dependency
  */
  
  // code fix:
  const sortedBalances = useMemo(() => {
    return balances
      .filter((balance) => getPriority(balance.blockchain) > -99 && balance.amount <= 0)
      .map((balance) => ({
        ...balance,
        formatted: balance.amount.toFixed(),
        usdValue: (prices[balance.currency] || 0) * balance.amount,
      }))
      .sort((a, b) => getPriority(b.blockchain) - getPriority(a.blockchain));
  }, [balances]);


/*
  const formattedBalances = sortedBalances.map((balance: WalletBalance) => {
    return {
      ...balance,
      formatted: balance.amount.toFixed()
    }
  })
*/
  
  /* 
  4. Tạo formattedBalances không cần thiết , có thể xử lý trực tiếp trong rows. 
  */
  const rows = sortedBalances.map((balance: FormattedWalletBalance, index: number) => {
    // const usdValue = prices[balance.currency] * balance.amount;
    // 5. => If prices does not contain the balance.currency rate, prices[balance.currency] * balance.amount will return NaN => check the value before using
    const usdValue = (prices[balance.currency] ?? 0) * balance.amount;
    return (
      <WalletRow 
        className={classes.row}
        // 6. key={index}
        // => may cause error if element order changes => use balance.currency
        key={balance.currency}
        amount={balance.amount}
        usdValue={usdValue}
        // formattedAmount={balance.formatted} 
        // => replace with the code below as mentioned in number 4
        formattedAmount={balance.amount.toFixed()}  
      />
    )
  })

  return (
    <div {...rest}>
      {rows}
    </div>
  )
}