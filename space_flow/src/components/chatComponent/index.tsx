import { Transition } from "@headlessui/react";
import {
  ChatBubbleBottomCenterTextIcon,
  PaperAirplaneIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { useContext, useState } from "react";
import { sendAll } from "../../controllers/NodesServices";
import { alertContext } from "../../contexts/alertContext";

const _ = require("lodash");

export default function Chat({ reactFlowInstance }) {
  const [open, setOpen] = useState(true);
  const [chatValue, setChatValue] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const {setErrorData} = useContext(alertContext);
  const addChatHistory = (message, isSend) => {
    setChatHistory((old) => {
      let newChat = _.cloneDeep(old);
      newChat.push({ message, isSend });
      return newChat;
    });
  };
  function validateNodes(){
    if(reactFlowInstance.getNodes().some((n) => (n.data.node && Object.keys(n.data.node.template).some((t: any) => (n.data.node.template[t].required && !reactFlowInstance.getEdges().some((e) => (e.sourceHandle.split('|')[1] === t && e.sourceHandle.split('|')[2] === n.id))))))){
      return false;
    }
    return true;
  }
  return (
    <>
      <Transition
        show={open}
        appear={true}
        enter="transition ease-out duration-300"
        enterFrom="translate-y-96"
        enterTo="translate-y-0"
        leave="transition ease-in duration-300"
        leaveFrom="translate-y-0"
        leaveTo="translate-y-96"
      >
        <div className="w-[400px] absolute bottom-0 right-6">
          <div className="border h-full rounded-xl rounded-b-none bg-white shadow">
            <div className="flex justify-between items-center px-5 py-3 border-b">
              <div className="flex gap-3 text-xl font-medium items-center">
                <ChatBubbleBottomCenterTextIcon className="h-8 w-8 mt-1 text-blue-600" />
                Chat
              </div>
              <button
                onClick={() => {
                  setOpen(false);
                }}
              >
                <XMarkIcon className="h-6 w-6 text-gray-600" />
              </button>
            </div>
            <div className="w-full h-[400px] flex gap-3 mb-auto overflow-y-auto flex-col bg-gray-50 p-3 py-5">
              {chatHistory.map((c, i) => (
                <div key={i}>
                  {c.isSend ? (
                    <div className="w-full text-start">
                      <div className="text-start inline-block bg-gray-200 rounded-xl p-3 overflow-hidden w-fit max-w-[280px] px-5 text-sm font-normal rounded-tl-none">
                        {c.message}
                      </div>
                    </div>
                  ) : (
                    <div className="w-full text-end">
                      <div className="text-start inline-block bg-blue-600 rounded-xl p-3 overflow-hidden w-fit max-w-[280px] px-5 text-sm text-white font-normal rounded-tr-none">
                        {c.message}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div className="w-full bg-white border-t flex items-center justify-between p-3">
              <div className="relative w-full mt-1 rounded-md shadow-sm">
                <input
                  type="text"
                  value={chatValue}
                  onChange={(e) => {
                    setChatValue(e.target.value);
                  }}
                  className="form-input block w-full rounded-md border-gray-300 pr-10 sm:text-sm"
                  placeholder="Send a message..."
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                  <button
                    onClick={() => {
                      if(validateNodes()){
                        let message = chatValue;
                        setChatValue("");
                        addChatHistory(message, true);
                        sendAll({
                          message,
                          nodes: reactFlowInstance.getNodes(),
                          edges: reactFlowInstance.getEdges(),
                        }).then((r) => {addChatHistory(r, false)});
                      } else {
                        setErrorData({title: 'Error sending message', list:['There are required fields not filled yet.']})
                      }
                      
                    }}
                  >
                    <PaperAirplaneIcon
                      className="h-5 w-5 text-gray-400 hover:text-gray-600"
                      aria-hidden="true"
                    />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Transition>
      <Transition
        show={!open}
        appear={true}
        enter="transition ease-out duration-300"
        enterFrom="translate-y-96"
        enterTo="translate-y-0"
        leave="transition ease-in duration-300"
        leaveFrom="translate-y-0"
        leaveTo="translate-y-96"
      >
        <div className="absolute bottom-0 right-6">
          <div className="border flex justify-center align-center py-2 px-4 rounded-xl rounded-b-none bg-white shadow">
            <button
              onClick={() => {
                setOpen(true);
              }}
            >
              <div className="flex gap-3 text-lg font-medium items-center">
                <ChatBubbleBottomCenterTextIcon className="h-8 w-8 mt-1 text-blue-600" />
                Chat
              </div>
            </button>
          </div>
        </div>
      </Transition>
    </>
  );
}