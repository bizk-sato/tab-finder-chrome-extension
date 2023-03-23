import React, { useEffect, useState } from 'react'
import { FaTrash } from "react-icons/fa";
import './App.css'

function App() {
  const [tabs, setTabs] = useState<chrome.tabs.Tab[]>([])
  const [currentTabId, setCurrentTabId] = useState<number | undefined>(undefined)

  const assignTabs = async function() {
    await chrome.tabs.query({}, function(tabs) {
      setTabs(tabs)
    })
  }

  const assignCurrentTabId = async function() {
    let queryOptions = { active: true, lastFocusedWindow: true };
    // `tab` will either be a `tabs.Tab` instance or `undefined`.
    let [tab] = await chrome.tabs.query(queryOptions);
    setCurrentTabId(tab?.id);
  }

  const updateTabInfo = async function() {
    await assignTabs()
    await assignCurrentTabId()
  }

  useEffect(() => {
    updateTabInfo()
  }, [])

  useEffect(() => {
    const elemnt = document.getElementById(`${currentTabId}`)
    elemnt?.focus()
  }, [currentTabId])

  const isActive = (tabId: number) => {
    return tabId == currentTabId
  }

  const makeTabActive = async function(tabId: number) {
    await chrome.tabs.update(tabId, { active: true }, function () {})
  }

  const closeTab = async function(tabId: number) {
    await chrome.tabs.remove(tabId)
    await assignTabs()
  }

  const formatText = (text: String | undefined) => {
    if ((text?.length ?? 0) <= 25) return text

    return text?.substring(0, 24) + "..."
  }

  const onKeyDown = async function(e: React.KeyboardEvent, tabId: number) {
    if(e.key == "Enter") await makeTabActive(tabId)
    if(e.key == "Backspace") await closeTab(tabId)
  }

  return (
    <div className="App">
      <div className="content-wrapper">
        <ol className="tabs">
          {
            tabs.map((tab, index) => {
              return (
              <li tabIndex={index} id={`${tab.id}`} key={tab.id} className={isActive(tab.id!) ? "active" : ""} onKeyDown={async (e) => await onKeyDown(e, tab.id!)}>
                <span onClick={async () => await makeTabActive(tab.id!)}>{formatText(tab.title)}</span>
                <span onClick={async () => await closeTab(tab.id!)}><FaTrash className="trash-icon" /></span>
              </li>)
            })
          }
        </ol>
      </div>
    </div>
  )
}

export default App
