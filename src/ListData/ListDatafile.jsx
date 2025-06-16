import React, { useEffect, useState } from "react";
// import { FaArrowRight, FaArrowLeft } from "react-icons/fa";

function ListDatafile() {
  const [lists, setLists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [failure, setFailure] = useState(false);
  const [selectedLists, setSelectedLists] = useState([]);
  const [viewMode, setViewMode] = useState("ALL_LISTS"); // or "LIST_CREATION"
  const [tempLists, setTempLists] = useState({
    list1: [],
    list2: [],
    newList: [],
  });
  const [errorMsg, setErrorMsg] = useState("");

  const fetchLists = () => {
    setLoading(true);
    setFailure(false);
    fetch("https://apis.ccbp.in/list-creation/lists")
      .then((res) => res.json())
      .then((data) => {
        setLists(data.lists || []);
        setLoading(false);
      })
      .catch(() => {
        setFailure(true);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchLists();
  }, []);

  const handleCheckbox = (listNum) => {
    if (selectedLists.includes(listNum)) {
      setSelectedLists(selectedLists.filter((num) => num !== listNum));
    } else if (selectedLists.length < 2) {
      setSelectedLists([...selectedLists, listNum]);
    }
  };

  const handleCreateNewList = () => {
    if (selectedLists.length !== 2) {
      setErrorMsg("You should select exactly 2 lists to create a new list");
      return;
    }

    const [listA, listB] = selectedLists;
    setTempLists({
      list1: lists.filter((i) => i.list_number === listA),
      list2: lists.filter((i) => i.list_number === listB),
      newList: [],
    });
    setViewMode("LIST_CREATION");
    setErrorMsg("");
  };

  const moveItem = (item, fromList, toList) => {
    setTempLists((prev) => ({
      ...prev,
      [fromList]: prev[fromList].filter((i) => i.id !== item.id),
      [toList]: [...prev[toList], item],
    }));
  };

  const handleUpdate = () => {
    const updated = [
      ...tempLists.list1.map((i) => ({ ...i, list_number: selectedLists[0] })),
      ...tempLists.list2.map((i) => ({ ...i, list_number: selectedLists[1] })),
      ...tempLists.newList.map((i) => ({ ...i, list_number: 3 })),
    ];
    setLists(updated);
    setSelectedLists([]);
    setViewMode("ALL_LISTS");
  };

  const handleCancel = () => {
    setViewMode("ALL_LISTS");
    setSelectedLists([]);
  };

  const renderList = (items, listKey, arrows = {}) => (
    <div className="flex-1 max-w-sm bg-sky-100 rounded-xl p-4 shadow-md border border-gray-300 max-h-[500px] overflow-auto">
      <div className="flex gap-2 mb-4 items-center">
        {listKey !== "newList" && (
          <input
            type="checkbox"
            checked={selectedLists.includes(listKey === "list1" ? 1 : 2)}
            onChange={() => handleCheckbox(listKey === "list1" ? 1 : 2)}
            className="w-5 h-5"
          />
        )}
        <h2 className="text-xl font-semibold capitalize">{listKey}</h2>
      </div>
      {items.map((item) => (
        <div
          key={item.id}
          className="mb-4 p-4 border border-gray-200 rounded-lg shadow-sm bg-white flex justify-between items-center"
        >
          <div>
            <h3 className="font-medium text-lg">{item.name}</h3>
            <p className="text-sm text-gray-600">{item.description}</p>
          </div>
          <div className="flex gap-2">
            {arrows.left && (
              <FaArrowLeft
                className="cursor-pointer text-gray-600"
                onClick={() => moveItem(item, listKey, arrows.left)}
              />
            )}
            {arrows.right && (
              <FaArrowRight
                className="cursor-pointer text-gray-600"
                onClick={() => moveItem(item, listKey, arrows.right)}
              />
            )}
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="font-bold text-3xl mb-4 text-gray-800">List Creation</h1>
      {errorMsg && <p className="text-red-600 mb-2">{errorMsg}</p>}
      {viewMode === "ALL_LISTS" && (
        <>
          <button
            className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700"
            // onClick={handleCreateNewList}
          >
            Create a New List
          </button>
          {loading ? (
            <div className="flex justify-center items-center mt-10">
              <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : failure ? (
            <div className="text-center mt-10">
              <img
                src="https://assets.ccbp.in/frontend/content/react-js/list-creation-failure-lg-output.png"
                alt="failure"
                className="mx-auto"
              />
              <button
                className="mt-4 px-4 py-2 bg-red-500 text-white rounded"
                onClick={fetchLists}
              >
                Try Again
              </button>
            </div>
          ) : (
            <div className="flex flex-col md:flex-row gap-6 mt-8 p-4 rounded-xl">
              {renderList(
                lists.filter((i) => i.list_number === 1),
                "list1"
              )}
              {renderList(
                lists.filter((i) => i.list_number === 2),
                "list2"
              )}
            </div>
          )}
        </>
      )}

      {viewMode === "LIST_CREATION" && (
        <>
          <div className="flex flex-col md:flex-row gap-6 mt-8 p-4 rounded-xl">
            {renderList(tempLists.list1, "list1", { right: "newList" })}
            {renderList(tempLists.newList, "newList", {
              left: "list1",
              right: "list2",
            })}
            {renderList(tempLists.list2, "list2", { left: "newList" })}
          </div>
          <div className="flex gap-4 mt-6">
            <button
              className="px-4 py-2 rounded-md bg-gray-400 text-white hover:bg-gray-500"
              onClick={handleCancel}
            >
              Cancel
            </button>
            <button
              className="px-4 py-2 rounded-md bg-green-600 text-white hover:bg-green-700"
              onClick={handleUpdate}
            >
              Update
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default ListDatafile;
