
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
    Đoạn code trên có 1 số điểm:
1. Biến chưa được định nghĩa (lhsPriority) => thay bằng balancePriority vì nó đã được tính toán từ trước.
2. Đoạn code sử dụng .filter() trước rồi mới .sort() khiến mảng balances bị duyệt hai lần, gây lãng phí tài nguyên => sử dụng .reduce() hoặc thực hiện trong cùng một .sort()
3. Dependency [balances, prices] không cần thiết: prices không ảnh hưởng đến sortedBalances, nên không cần đưa vào dependency
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
    // 5. => Nếu prices không chứa tỷ giá của balance.currency, phép nhân prices[balance.currency] * balance.amount sẽ trả về NaN => kiểm tra giá trị trước khi sử dụng
    const usdValue = (prices[balance.currency] ?? 0) * balance.amount;
    return (
      <WalletRow 
        className={classes.row}
        // 6. key={index}
        // => có thể gây lỗi nếu thứ tự phần tử thay đổi => dùng balance.currency
        key={balance.currency}
        amount={balance.amount}
        usdValue={usdValue}
        // formattedAmount={balance.formatted} 
        // => thay thế bằng code bên dưới như nói ở số 4
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