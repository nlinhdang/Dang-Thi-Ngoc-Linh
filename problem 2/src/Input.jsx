import { useState, useRef } from "react";
import arrow from "/assets/exchange.png";
import CurrencyDropdown from "./CurrencyCropdown";

const Input = () => {
  // chỉ cập nhật giá trị khi user click Swap
  const sendInputRef = useRef(null);
  const receiveInputRef = useRef(null);

  // State chỉ dùng để cập nhật giao diện sau khi click
  const [displaySendAmount, setDisplaySendAmount] = useState("");
  const [displayReceiveAmount, setDisplayReceiveAmount] = useState("");

  const [choseInput, setChoseInput] = useState({
    currency: "BLUR",
    price: 0.20811525423728813
  });

  const [choseOutput, setChoseOutput] = useState({
    currency: "BLUR",
    price: 0.20811525423728813
  });

  const [errorMessenge, setErrorMessenge] = useState("");
  const [lastEdited, setLastEdited] = useState(null);
  const [rate, setRate] = useState(choseInput.price / choseOutput.price);
  const [isLoading, setIsLoading] = useState(false);

  //xử lý khi người dùng chọn currency
  const handleChose = (currency, price, type) => {
    if (type === "input") {
      setChoseInput({ currency, price });
      setRate(price / choseOutput.price);
    } else {
      setChoseOutput({ currency, price });
      setRate(choseInput.price / price);
    }
  };

  // check input ko bao gồm chữ và ký tự khác số
  const validateInput = (value) => {
    const rawValue = value.replace(/,/g, "");
    if (/^\d*$/.test(rawValue)) {
      setErrorMessenge("");
      return true;
    } else {
      setErrorMessenge("Please enter a number");
      return false;
    }
  };

  //nếu có thay đổi: lấy giá trị người dùng vừa nhập, cập nhật setLastEdited là send hoặc receive để tính tỉ giá
  const handleSendChange = (e) => {
    if (validateInput(e.target.value)) {
      sendInputRef.current.value = e.target.value;
      setLastEdited("send");
    }
  };

  const handleReceiveChange = (e) => {
    if (validateInput(e.target.value)) {
      receiveInputRef.current.value = e.target.value;
      setLastEdited("receive");
    }
  };
    // set thời gian đợi 3s sau khi click Swap mới hiển thị kết quả
    // số lượng cũng đc hiển thị theo format có dấu phẩy theo hàng nghìn, hàng triệu
  const handleClick = () => {
    setIsLoading(true);
    setTimeout(() => {
      const sendValue = sendInputRef.current.value.replace(/,/g, "");
      const receiveValue = receiveInputRef.current.value.replace(/,/g, "");

      if (lastEdited === "send") {
        const calculatedReceive = Number((sendValue * rate).toFixed(3));
        setDisplayReceiveAmount(calculatedReceive.toLocaleString());
        receiveInputRef.current.value = calculatedReceive.toLocaleString();
        setDisplaySendAmount(Number(sendValue).toLocaleString());
        sendInputRef.current.value = Number(sendValue).toLocaleString();
      } else {
        const calculatedSend = Number((receiveValue / rate).toFixed(3));
        setDisplaySendAmount(calculatedSend.toLocaleString());
        sendInputRef.current.value = calculatedSend.toLocaleString();
        setDisplayReceiveAmount(Number(receiveValue).toLocaleString());
        receiveInputRef.current.value = Number(receiveValue).toLocaleString();
      }

      setIsLoading(false);
    }, 3000);
  };

  return (
    <>
      <div className="exchange-section">
        <div className="input-container">
          <label htmlFor="input-amount">Amount to send</label>
          <input
            id="input-amount"
            type="text"
            ref={sendInputRef}
            onChange={handleSendChange}
            onFocus={() => (sendInputRef.current.value = "")}
            defaultValue={displaySendAmount}
          />
          <CurrencyDropdown sendChoseToRate={(currency, price) => handleChose(currency, price, "input")} />
        </div>

        <img src={arrow} alt="" className="arrow" />

        <div className="output-container">
          <label htmlFor="output-amount">Amount to receive</label>
          <input
            id="output-amount"
            type="text"
            ref={receiveInputRef}
            onChange={handleReceiveChange}
            onFocus={() => (receiveInputRef.current.value = "")}
            defaultValue={displayReceiveAmount}
          />
          <CurrencyDropdown sendChoseToRate={(currency, price) => handleChose(currency, price, "output")} />
        </div>
      </div>

      {errorMessenge && <p style={{ color: "red" }} className="error-messenge">{errorMessenge}</p>}

      <div className="rate-section">
        <div className="rate">
          1,000 {choseInput.currency} = {Number((rate * 1000).toFixed(3)).toLocaleString()} {choseOutput.currency}
        </div>

        <button
          onClick={handleClick}
          disabled={isLoading || !!errorMessenge}
          className={errorMessenge ? "can-not-swap" : ""}
        >
          {isLoading ? "Loading..." : errorMessenge ? "Can not swap" : "CONFIRM SWAP"}
      </button>
      </div>
    </>
  );
};

export default Input;
