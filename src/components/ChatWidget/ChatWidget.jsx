import React, { useState, useRef, useEffect } from 'react';
import OpenAI from 'openai';
import './ChatWidget.css';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true // Nur für Entwicklung! In Produktion sollte die API über ein Backend angesprochen werden
});

const extractPageContent = () => {
  // Debug-Ausgabe
  console.log('Starte Extraktion des Seiteninhalts...');

  // Hole den Hauptinhalt der Seite
  const article = document.querySelector('article');
  if (!article) {
    console.warn('Kein article Element gefunden!');
    // Fallback: Versuche den gesamten Body-Inhalt zu extrahieren
    const body = document.body;
    const textContent = [];
    
    // Titel
    const title = document.querySelector('h1');
    if (title) {
      console.log('Gefundener Titel:', title.textContent);
      textContent.push(`Titel: ${title.textContent}`);
    }

    // Alle Textinhalte
    const allElements = body.querySelectorAll('p, h2, h3, h4, h5, h6, blockquote');
    allElements.forEach(element => {
      // Ignoriere den Chat-Widget-Inhalt
      if (!element.closest('.chat-widget')) {
        if (element.tagName === 'BLOCKQUOTE') {
          textContent.push(`Zitat: ${element.textContent}`);
        } else if (element.tagName.startsWith('H')) {
          textContent.push(`Überschrift: ${element.textContent}`);
        } else {
          textContent.push(element.textContent);
        }
      }
    });

    const extractedContent = textContent.join('\n\n');
    console.log('Extrahierter Inhalt:', extractedContent);
    return extractedContent;
  }

  // Wenn article gefunden wurde, extrahiere dessen Inhalt
  const textContent = [];
  
  // Titel
  const title = article.querySelector('h1, h2:first-of-type');
  if (title) {
    console.log('Gefundener Titel:', title.textContent);
    textContent.push(`Titel: ${title.textContent}`);
  }

  // Hauptinhalt
  const contentElements = article.querySelectorAll('p, h2, h3, h4, h5, h6, blockquote');
  contentElements.forEach(element => {
    if (element.tagName === 'BLOCKQUOTE') {
      textContent.push(`Zitat: ${element.textContent}`);
    } else if (element.tagName.startsWith('H')) {
      textContent.push(`Überschrift: ${element.textContent}`);
    } else {
      textContent.push(element.textContent);
    }
  });

  const extractedContent = textContent.join('\n\n');
  console.log('Extrahierter Inhalt:', extractedContent);
  return extractedContent;
};

const renderMessageWithLinks = (text) => {
  // Teile den Text in Absätze
  const paragraphs = text.split('\n\n');
  
  const renderFormattedText = (text) => {
    // Konvertiere den Text zuerst in Zeilen
    const lines = text.split('\n');
    let formattedLines = [];

    lines.forEach(line => {
      // Verarbeite die Zeile für verschiedene Formatierungen
      let processedLine = line;
      let parts = [];
      let lastIndex = 0;

      // Regex für fett gedruckten Text
      const boldRegex = /\*\*([^*]+)\*\*/g;
      let match;

      // Verarbeite alle fett gedruckten Teile in der Zeile
      while ((match = boldRegex.exec(line)) !== null) {
        // Text vor dem fett gedruckten Teil
        if (match.index > lastIndex) {
          parts.push(line.slice(lastIndex, match.index));
        }

        // Fett gedruckter Text
        parts.push(<strong key={`bold-${match.index}`}>{match[1]}</strong>);
        lastIndex = match.index + match[0].length;
      }

      // Restlicher Text nach dem letzten fett gedruckten Teil
      if (lastIndex < line.length) {
        parts.push(line.slice(lastIndex));
      }

      // Wenn keine fett gedruckten Teile gefunden wurden, verwende die originale Zeile
      if (parts.length === 0) {
        parts = [line];
      }

      // Prüfe auf spezielle Formatierungen (Überschriften, Listen)
      if (line.match(/^#\s+/)) {
        // Entferne die Hashtags am Anfang
        const headingText = line.replace(/^#+\s+/, '');
        formattedLines.push(
          <h1 key={`h1-${line}`} className="chat-heading">
            {renderFormattedText(headingText)}
          </h1>
        );
      } else if (line.match(/^##\s+/)) {
        // Entferne die Hashtags am Anfang
        const headingText = line.replace(/^#+\s+/, '');
        formattedLines.push(
          <h2 key={`h2-${line}`} className="chat-heading">
            {renderFormattedText(headingText)}
          </h2>
        );
      } else if (line.match(/^-\s+/)) {
        // Entferne das Minuszeichen am Anfang
        const bulletText = line.replace(/^-\s+/, '');
        formattedLines.push(
          <div key={`bullet-${line}`} className="list-item bullet">
            {renderFormattedText(bulletText)}
          </div>
        );
      } else if (parts.length > 0) {
        formattedLines.push(
          <div key={`line-${line}`}>
            {parts}
          </div>
        );
      }
    });

    return formattedLines;
  };

  return (
    <>
      {paragraphs.map((paragraph, index) => (
        <div 
          key={index} 
          className="chat-paragraph"
        >
          {renderFormattedText(paragraph)}
        </div>
      ))}
    </>
  );
};

const ChatWidget = () => {
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const chatMessagesRef = useRef(null);
  const [pageContent, setPageContent] = useState('');

  useEffect(() => {
    // Extrahiere den Seiteninhalt beim ersten Laden
    const content = extractPageContent();
    console.log('Initial extrahierter Content:', content);
    setPageContent(content);

    // Beobachte Änderungen am Artikel
    const observer = new MutationObserver(() => {
      const updatedContent = extractPageContent();
      console.log('Aktualisierter Content:', updatedContent);
      setPageContent(updatedContent);
    });

    const article = document.querySelector('article');
    const target = article || document.body;
    
    observer.observe(target, {
      childList: true,
      subtree: true,
      characterData: true
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (chatMessagesRef.current) {
      chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const generateResponse = async (userMessage) => {
    try {
      console.log('Sende Anfrage an OpenAI mit folgendem Kontext:', pageContent);
      
      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: `Du bist ein hilfreicher Assistent für einen Blog-Artikel über KI. 
                     Deine Aufgabe ist es, Fragen der Leser zum Artikelinhalt zu beantworten.
                     
                     Wichtige Regeln für die Formatierung deiner Antworten:

                     1. Beginne JEDE Antwort mit einer Hauptüberschrift:
                        # Deine Hauptüberschrift

                     2. Gliedere deine Antwort IMMER in Abschnitte mit Unterüberschriften:
                        ## Erster Abschnitt
                        ## Zweiter Abschnitt
                        usw.

                     3. Formatiere wichtige Begriffe und Kernaussagen IMMER in Fettdruck:
                        Beispiel: Die **künstliche Intelligenz** hat sich entwickelt...

                     4. Verwende IMMER Aufzählungszeichen für Listen:
                        - Erster Punkt
                        - Zweiter Punkt

                     5. Struktur für lange Antworten:
                        # Hauptthema
                        
                        ## Kurze Zusammenfassung
                        Die wichtigsten Punkte in 2-3 Sätzen...

                        ## Detaillierte Erklärung
                        - Punkt 1
                        - Punkt 2

                        ## Fazit
                        Abschließende Gedanken...

                     6. Struktur für kurze Antworten:
                        # Thema
                        
                        ## Antwort
                        Deine Erklärung mit **wichtigen Begriffen**...

                     7. Bei Quellenangaben:
                        ## Weiterführende Quellen
                        - [Beschreibung](URL)

                     WICHTIG: Halte dich STRIKT an diese Formatierungsregeln!
                     
                     Hier ist der Artikelinhalt:

                     ${pageContent}`
          },
          {
            role: "user",
            content: userMessage
          }
        ],
        temperature: 0.7,
        max_tokens: 500
      });

      console.log('Antwort von OpenAI:', completion.choices[0].message.content);
      return completion.choices[0].message.content;
    } catch (err) {
      console.error('OpenAI API Fehler:', err);
      throw new Error('Entschuldigung, es gab einen Fehler bei der Verarbeitung Ihrer Anfrage.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    try {
      if (!isHistoryOpen) {
        setIsHistoryOpen(true);
      }

      const userMessage = inputText.trim();
      setMessages([...messages, { text: userMessage, sender: 'user' }]);
      setIsLoading(true);
      setError(null);
      console.log('Nachricht wird gesendet...');
      setInputText('');

      const response = await generateResponse(userMessage);
      console.log('Erhaltene Antwort:', response);
      
      if (typeof response === 'string') {
        setMessages(prev => [...prev, { 
          text: response, 
          sender: 'bot' 
        }]);
        console.log('Antwort wurde zum Chat hinzugefügt');
      } else {
        throw new Error('Unerwartetes Antwortformat von der API');
      }

    } catch (err) {
      console.error('Fehler bei der Verarbeitung:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="chat-widget centered">
      {isHistoryOpen && (
        <div className="chat-history">
          <div className="chat-messages" ref={chatMessagesRef}>
            {messages.map((msg, idx) => (
              <div key={idx} className={`message ${msg.sender}`}>
                {msg.sender === 'bot' ? renderMessageWithLinks(msg.text) : msg.text}
              </div>
            ))}
            {isLoading && (
              <div className="message bot loading">
                KI denkt nach...
              </div>
            )}
            {error && (
              <div className="message error">
                {error}
              </div>
            )}
          </div>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="chat-input-form">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Stellen Sie eine Frage zum Artikel..."
          disabled={isLoading}
        />
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Sendet...' : 'Fragen'}
        </button>
      </form>
    </div>
  );
};

export default ChatWidget;
