import { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { ChatWindow } from './components/ChatWindow';
import { InputBar } from './components/InputBar';
import { UploadPanel } from './components/UploadPanel';
import { useChat } from './hooks/useChat';
import { useUpload } from './hooks/useUpload';

function App() {
  const {
    messages,
    mode,
    setMode,
    isLoading,
    input,
    setInput,
    sendMessage,
    stopGeneration,
    clearSession,
    isMockMode,
  } = useChat();

  const {
    uploadedFiles,
    uploadFile,
    removeFile
  } = useUpload();

  const [isUploadPanelOpen, setIsUploadPanelOpen] = useState(false);

  const handleSendMessage = () => {
    if (input.trim()) {
      sendMessage(input.trim());
    }
  };

  const handleInjectInput = (text: string) => {
    setInput(text);
    // Optional: auto-submit if desired, or just let them edit
  };

  return (
    <div className="flex h-full w-full bg-base overflow-hidden">
      <Sidebar
        mode={mode}
        onModeChange={setMode}
        onNewSession={clearSession}
        onInjectInput={handleInjectInput}
      />
      
      <div className="flex flex-col flex-1 min-w-0 bg-[#080810]">
        <Header
          mode={mode}
          uploadCount={uploadedFiles.length}
          uploadPanelOpen={isUploadPanelOpen}
          onToggleUpload={() => setIsUploadPanelOpen(!isUploadPanelOpen)}
          isMockMode={isMockMode}
        />
        
        <div className="flex-1 flex flex-col relative overflow-hidden">
          <ChatWindow
            messages={messages}
            isLoading={isLoading}
          />
          
          <div 
            className="w-full max-w-[780px] mx-auto px-5 pb-6 pt-2"
            style={{ 
              background: 'linear-gradient(rgba(8,8,16,0) 0%, rgba(8,8,16,1) 30%)' 
            }}
          >
            <UploadPanel
              open={isUploadPanelOpen}
              files={uploadedFiles}
              onUpload={uploadFile}
              onRemove={removeFile}
            />
            
            <InputBar
              input={input}
              mode={mode}
              isLoading={isLoading}
              onChange={setInput}
              onSubmit={handleSendMessage}
              onStop={stopGeneration}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;

