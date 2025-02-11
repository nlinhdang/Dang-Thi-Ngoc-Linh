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
  const dropdownRef = useRef(null);

  // CLOSE/OPEN currency dropdown menu
  const toggleDropdown = () => {
    setIsOpen((prev) => !prev);
  };

  //select currency and put in state setSelectedCurrency
  const selectCurrency = (currency, token) => {
    setSelectedCurrency({ currency, token });
    setIsOpen(false); // Đóng menu sau khi chọn
  };

//fetch data get currency and token path
useEffect(() => {
  fetch("/prices.json")
    .then((res) => res.json())
    .then(async (data) => {
      const currencyMap = {};

      for (const item of data) {
        const { currency, price, date } = item;
        let tokenPath = `/assets/tokens/${currency}.svg`;

        // Check if image is valid (not text/html)
        const isValidImage = await fetch(tokenPath)
          .then((res) => res.headers.get("Content-Type")?.startsWith("image"))
          .catch(() => false);

        // If valid image then add to list
        // If currency is duplicate then choose oldest date, if duplicate date then take newest found
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


  // when click outside, dropdown menu close
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
