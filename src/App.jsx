import "./App.css";
import { useEffect, useState, useRef } from "react";
import { mock } from "./mock/apiDataMock";
import AutoCompleteCard from "./components/AutoCompletePT/AutoCompleteCard";

export default function App() {
  const [response, setResponse] = useState([]);
  const [suggestion, setSuggestion] = useState();
  const [itemsArr, setItemsArr] = useState("");
  const [userFound, setUserFound] = useState(true);
  const [cursor, setCursor] = useState(-1);
  const [keyboardActive, setKeyBoardActive] = useState(false);
  const classNameNoHover = keyboardActive ? `noHover` : "hover";
  const ERROR_MSG = "No User Found";

  async function fetchData() {
    const data = await fetch("http://www.mocky.io/v2/5ba8efb23100007200c2750c");
    if (!data.ok) {
      setResponse(mock);
      return;
    }
    const responseApi = await data.json();
    setResponse(responseApi);
  }

  const ref = useRef(null);
  const resultRef = useRef(null);

  useEffect(() => {
    fetchData();
    ref.current.focus();
  }, []);

  const scrollIntoView = (position) => {
    return resultRef.current.scrollTo(position, position - 60);
  };

  useEffect(() => {
    if (cursor < 0 || cursor > suggestion?.length || !resultRef) {
      return () => {};
    }

    let listItems = Array.from(resultRef.current.children);
    listItems[cursor] && scrollIntoView(listItems[cursor].offsetTop);
  }, [cursor]);

  const handleChange = (text) => {
    if (!text) {
      setSuggestion([]);
      setItemsArr("");
      setUserFound(true);
      return;
    } else {
      const propertiesToSearch = ["name", "id", "address", "pincode"];
      const newData = response.filter((item) => {
        const reg = new RegExp(`${text}`, `gi`);
        const found = propertiesToSearch.some((prop) => {
          return item[prop].match(reg);
        });

        if (found) {
          return true;
        }

        if (item.items.join(" ").match(reg)) {
          setItemsArr(item.items.join(" ").match(reg));
          return true;
        }

        return false;
      });

      if (newData.length) {
        setUserFound(true);
        setCursor(-1);
        scrollIntoView(0);
        setSuggestion(newData);
      } else {
        setUserFound(false);
      }
    }
  };

  const handleMouseChange = (e) => {
    setKeyBoardActive(false);
  };

  const keyboardNavigation = (e) => {
    if (e.key === "ArrowDown") {
      setKeyBoardActive(true);
      resultRef.current.focus();
      setCursor((c) => (c < suggestion?.length - 1 ? c + 1 : c));
    }

    if (e.key === "ArrowUp") {
      setKeyBoardActive(true);
      setCursor((c) => (c > 0 ? c - 1 : 0));
    }
  };

  return (
    <div className="Container" onMouseMove={(e) => handleMouseChange(e)}>
      <h1>Parspec Assignment</h1>

      <input
        ref={ref}
        name={"search"}
        onChange={(e) => {
          handleChange(e.target.value);
        }}
        onKeyDown={(e) => keyboardNavigation(e)}
      />
      <div className={`card-container ${classNameNoHover}`} ref={resultRef}>
        {userFound ? (
          suggestion?.length > 0 &&
          suggestion.map((item, i) => {
            return (
              <div key={i}>
                <AutoCompleteCard
                  item={item}
                  itemsArr={itemsArr}
                  index={i}
                  isHighlighted={cursor === i ? true : false}
                />
              </div>
            );
          })
        ) : (
          <div className="no-user-found">{ERROR_MSG}</div>
        )}
      </div>
    </div>
  );
}
