
import React, { useState, useCallback, useRef } from 'react';
import { UploadIcon, SparklesIcon } from './components/icons';
import ImageEditorModal from './components/ImageEditorModal';

const App: React.FC = () => {
  const [fileToEdit, setFileToEdit] = useState<File | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleModalClose = useCallback(() => {
    setIsModalOpen(false);
    setFileToEdit(null);
    setError(null);
    if (fileInputRef.current) {
        fileInputRef.current.value = "";
    }
  }, []);

  const handleFileSelect = (files: FileList | null) => {
    if (files && files.length > 0) {
      const file = files[0];
      if (!file.type.startsWith('image/')) {
        setError('Por favor, selecione um arquivo de imagem válido.');
        return;
      }
      setError(null);
      setFileToEdit(file);
      setIsModalOpen(true);
    }
  };

  const handleDragEvents = (e: React.DragEvent<HTMLDivElement>, isEntering: boolean) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(isEntering);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    handleDragEvents(e, false);
    handleFileSelect(e.dataTransfer.files);
  };
  
  const Uploader = () => (
    <div 
      className={`relative p-8 transition-all duration-300 rounded-2xl border-2 border-dashed
        ${isDragging 
            ? 'bg-sky-50 dark:bg-sky-900/50 border-sky-500' 
            : 'bg-white dark:bg-slate-800/50 border-slate-300 dark:border-slate-600 hover:border-sky-500'
        }`}
      onDragEnter={(e) => handleDragEvents(e, true)}
      onDragOver={(e) => handleDragEvents(e, true)}
      onDragLeave={(e) => handleDragEvents(e, false)}
      onDrop={handleDrop}
      onClick={() => fileInputRef.current?.click()}
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={(e) => handleFileSelect(e.target.files)}
        accept="image/*"
        className="hidden"
        aria-label="File Uploader"
      />
      <div className="flex flex-col items-center justify-center text-center space-y-4 cursor-pointer">
          <div className="p-3 bg-sky-100 dark:bg-sky-900 rounded-full text-sky-600 dark:text-sky-300">
            <UploadIcon className="w-8 h-8" />
          </div>
          <p className="text-slate-700 dark:text-slate-300 font-semibold">
            Clique para enviar ou arraste e solte uma imagem
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            PNG, JPG, WEBP, etc.
          </p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-slate-50 transition-colors">
      <main className="w-full max-w-2xl mx-auto flex flex-col items-center text-center">
        <div className="mb-2 p-2 bg-sky-100 dark:bg-sky-900/50 text-sky-600 dark:text-sky-400 rounded-full">
            <SparklesIcon className="w-7 h-7" />
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-slate-800 dark:text-slate-100">
          Removedor de Fundo com IA
        </h1>
        <p className="mt-4 max-w-xl text-slate-600 dark:text-slate-400 text-base sm:text-lg">
          Envie uma imagem e nossa inteligência artificial removerá o fundo com precisão em segundos. É rápido, fácil e gratuito.
        </p>
      
        <div className="w-full max-w-lg mt-8 sm:mt-12">
          <Uploader />
          {error && <p className="mt-4 text-center text-red-500 bg-red-100 dark:bg-red-900/50 p-3 rounded-lg">{error}</p>}
        </div>
      </main>

      <ImageEditorModal 
        isOpen={isModalOpen}
        onClose={handleModalClose}
        file={fileToEdit}
      />
      
      <footer className="mt-12 text-center text-slate-500 dark:text-slate-400 text-sm">
        <p>&copy; {new Date().getFullYear()} Criado com IA. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
};

export default App;
