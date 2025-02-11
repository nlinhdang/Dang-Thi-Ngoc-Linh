import { useState, useEffect, useRef } from "react";
import arrowDown from "/assets/down.png";
import tick from "/assets/check.png";

function CurrencyDropdown({ sendChoseToRate }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState({
    currency: "BLUR",
    token: "/assets/tokens/BLUR.svg",
  });

  const [currencies, setCurrencies] = useState([]);
  const dropdownRef = useRef(null); // kiểm tra click bên ngoài

  // đóng mở menu currency
  const toggleDropdown = () => {
    setIsOpen((prev) => !prev);
  };

  //chọn currency và đưa và state setSelectedCurrency
  const selectCurrency = (currency, token) => {
    setSelectedCurrency({ currency, token });
    setIsOpen(false); // Đóng menu sau khi chọn
  };

//fetch data lất thông tin currency và token path
useEffect(() => {
  fetch("/prices.json")
    .then((res) => res.json())
    .then(async (data) => {
      const currencyMap = {};

      for (const item of data) {
        const { currency, price, date } = item;
        let tokenPath = `/assets/tokens/${currency}.svg`;

        // Kiểm tra ảnh có hợp lệ không (không phải text/html)
        const isValidImage = await fetch(tokenPath)
          .then((res) => res.headers.get("Content-Type")?.startsWith("image"))
          .catch(() => false);

        // Nếu ảnh hợp lệ mới thêm vào danh sách
        // Nếu currency bị trùng thì chọn date lớn nhất, nếu trùng date thì lấy cái thứ mới nhất tìm thấy
        if (isValidImage) {
          if (!currencyMap[currency] || new Date(currencyMap[currency].date) <= new Date(date)) {
            currencyMap[currency] = { ...item, token: tokenPath };
          }
        }
      }

      setCurrencies(Object.values(currencyMap));
    })
    .catch((err) => console.error("Lỗi JSON:", err));
}, []);


  // sự kiện click bên ngoài để đóng menu
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="dropdown" ref={dropdownRef}>
      <div className="currency-label" onClick={toggleDropdown}>
        <img src={selectedCurrency.token} alt="Token" className="token" />
        <span className="currency">{selectedCurrency.currency}</span>
        <img src={arrowDown} alt="Arrow" className={`arrow-down ${isOpen ? "rotate" : ""}`} />
      </div>

      {isOpen && (
        <ul className="dropdown-menu">
          {currencies.map((item) => (
            <li
              key={item.currency}
              onClick={() => {
                selectCurrency(item.currency, item.token);
                sendChoseToRate(item.currency, item.price);
              }}
            >
              <img src={item.token} alt={item.token} className="token-dropdown" />
              <span className="currency-dropdown">{item.currency}</span>
              <img src={tick} alt="tick" className={`tick ${selectedCurrency.currency === item.currency ? "active" : ""}`} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default CurrencyDropdown;
