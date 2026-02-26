import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FaArrowLeft,
  FaClock,
  FaHeadset,
  FaPaperPlane,
  FaReceipt,
  FaShieldAlt,
  FaUserCircle,
} from 'react-icons/fa';
import MainLayout from '../layouts/MainLayout';
import { useUI } from '../hooks/useUI';

const initialMessages = [
  {
    id: 1,
    sender: 'bot',
    text: 'Hi! Welcome to Zestora Support. Please share your issue with order ID for faster help.',
    time: 'Now',
  },
];

const quickTopics = ['Order delayed', 'Need refund', 'Wrong item', 'Payment failed', 'Cancel order'];

const formatTime = () =>
  new Date().toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

const getBotReply = (message) => {
  const text = message.toLowerCase();

  if (text.includes('delay') || text.includes('late')) {
    return 'Sorry for the delay. Please share your order ID. We are checking live status.';
  }
  if (text.includes('refund') || text.includes('cancel')) {
    return 'Refund is possible based on order state. Please share order ID and reason.';
  }
  if (text.includes('payment') || text.includes('upi') || text.includes('card')) {
    return 'Please share payment method, amount and time. We will verify the transaction.';
  }
  if (text.includes('wrong') || text.includes('item')) {
    return 'Sorry for this issue. Share order ID and item details for replacement/refund support.';
  }

  return 'Thanks. Please add your order ID and a short issue summary so we can help quickly.';
};

const Support = () => {
  const navigate = useNavigate();
  const { showToast } = useUI();
  const [messages, setMessages] = useState(initialMessages);
  const [messageInput, setMessageInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const scrollRef = useRef(null);
  const canSend = useMemo(() => messageInput.trim().length > 0, [messageInput]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  const appendBotMessage = (text) => {
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now() + Math.random(),
        sender: 'bot',
        text,
        time: formatTime(),
      },
    ]);
  };

  const handleSendMessage = (rawMessage) => {
    const text = rawMessage.trim();
    if (!text) return;

    setMessages((prev) => [
      ...prev,
      {
        id: Date.now(),
        sender: 'user',
        text,
        time: formatTime(),
      },
    ]);

    setMessageInput('');
    setIsTyping(true);

    window.setTimeout(() => {
      setIsTyping(false);
      appendBotMessage(getBotReply(text));
    }, 700);
  };

  return (
    <MainLayout>
      <div className="relative h-[100dvh] md:h-[calc(100dvh-5rem)] max-w-6xl mx-auto px-0 md:px-4 pt-0 md:pt-6 pb-0 overflow-hidden flex flex-col">
        <div className="absolute inset-x-0 top-0 -z-10 h-44 bg-[radial-gradient(circle_at_top_right,rgba(255,114,39,0.25),transparent_60%)] pointer-events-none" />

        <div className="px-3 md:px-0 pt-5 md:pt-2 mb-3 md:mb-4 flex items-center justify-between gap-3 shrink-0">
          <button
            onClick={() => navigate('/home')}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-zest-muted/20 bg-zest-card text-zest-text hover:border-zest-orange/40 transition-colors"
          >
            <FaArrowLeft />
            Back
          </button>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-zest-success/30 bg-zest-success/10 text-zest-success text-xs md:text-sm font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-zest-success" />
            Support Online
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[280px_minmax(0,1fr)] gap-0 md:gap-5 flex-1 min-h-0">
          <aside className="hidden lg:block rounded-3xl border border-zest-muted/20 bg-zest-card/85 backdrop-blur-md p-4 md:p-5 h-fit">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-11 h-11 rounded-2xl bg-zest-orange/20 text-zest-orange flex items-center justify-center">
                <FaHeadset />
              </div>
              <div>
                <h1 className="text-lg font-bold text-zest-text">Support Desk</h1>
                <p className="text-xs text-zest-muted">Zestora Care Team</p>
              </div>
            </div>

            <div className="space-y-2.5 text-sm">
              <div className="rounded-2xl border border-zest-muted/20 bg-zest-dark/40 px-3 py-2.5 flex items-center gap-2 text-zest-text">
                <FaClock className="text-zest-orange" />
                Avg response: 2 mins
              </div>
              <div className="rounded-2xl border border-zest-muted/20 bg-zest-dark/40 px-3 py-2.5 flex items-center gap-2 text-zest-text">
                <FaShieldAlt className="text-zest-success" />
                Secure private chat
              </div>
              <div className="rounded-2xl border border-zest-muted/20 bg-zest-dark/40 px-3 py-2.5 flex items-center gap-2 text-zest-text">
                <FaReceipt className="text-blue-400" />
                Keep order ID ready
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-zest-muted/20">
              <p className="text-xs text-zest-muted mb-2">Quick topics</p>
              <div className="flex flex-col gap-2">
                {quickTopics.map((topic) => (
                  <button
                    key={topic}
                    onClick={() => handleSendMessage(topic)}
                    className="w-full text-left px-3 py-2 rounded-xl border border-zest-muted/20 bg-zest-dark/30 text-zest-text hover:border-zest-orange/40 transition-colors text-sm"
                  >
                    {topic}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          <section className="rounded-none md:rounded-3xl border-x-0 md:border border-y border-zest-muted/5 bg-zest-card/90 backdrop-blur-md overflow-hidden shadow-none md:shadow-xl md:shadow-black/10 flex flex-col h-full min-h-0">
            <div className="px-4 py-3 md:px-5 md:py-4 border-b border-zest-muted/5 bg-gradient-to-r from-zest-orange/15 via-transparent to-zest-orange/10">
              <h2 className="text-lg md:text-xl font-bold text-zest-text">Live Chat Support</h2>
              <p className="text-xs md:text-sm text-zest-muted">Type your issue and our assistant will guide you.</p>
            </div>

            <div className="px-4 py-2.5 md:px-5 border-b border-zest-muted/5">
              <p className="text-xs text-zest-muted mb-2">Quick topics</p>
              <div className="flex gap-2 overflow-x-auto scrollbar-hide">
                {quickTopics.map((topic) => (
                  <button
                    key={`chip-${topic}`}
                    onClick={() => handleSendMessage(topic)}
                    className="whitespace-nowrap px-3 py-1.5 rounded-full text-xs md:text-sm border border-zest-muted/20 bg-zest-dark/30 text-zest-text hover:border-zest-orange/40 transition-colors"
                  >
                    {topic}
                  </button>
                ))}
              </div>
            </div>

            {!isMobile && (
              <div className="grid grid-cols-3 gap-2 px-4 md:px-5 pt-3">
                <div className="rounded-xl border border-zest-muted/20 bg-zest-dark/30 px-3 py-2 text-xs text-zest-muted">
                  <FaClock className="inline mr-1 text-zest-orange" />
                  Avg reply: 2 mins
                </div>
                <div className="rounded-xl border border-zest-muted/20 bg-zest-dark/30 px-3 py-2 text-xs text-zest-muted">
                  <FaShieldAlt className="inline mr-1 text-zest-success" />
                  Secure support chat
                </div>
                <div className="rounded-xl border border-zest-muted/20 bg-zest-dark/30 px-3 py-2 text-xs text-zest-muted">
                  <FaReceipt className="inline mr-1 text-blue-400" />
                  Keep order ID ready
                </div>
              </div>
            )}

              <div className="flex-1 min-h-0 overflow-y-auto px-4 py-3 pb-28 md:pb-24 md:px-5 space-y-3 bg-zest-dark/25 scrollbar-hide">
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-[86%] md:max-w-[74%] rounded-2xl px-3.5 py-2.5 ${
                      message.sender === 'user'
                        ? 'bg-zest-orange text-white rounded-br-md'
                        : 'bg-zest-card border border-zest-muted/20 text-zest-text rounded-bl-md'
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      {message.sender === 'bot' ? (
                        <FaHeadset className="text-zest-orange text-sm mt-0.5 flex-shrink-0" />
                      ) : (
                        <FaUserCircle className="text-white/90 text-sm mt-0.5 flex-shrink-0" />
                      )}
                      <p className="text-sm leading-5">{message.text}</p>
                    </div>
                    <p className={`mt-1 text-[11px] ${message.sender === 'user' ? 'text-white/80' : 'text-zest-muted'}`}>{message.time}</p>
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex justify-start">
                  <div className="rounded-2xl rounded-bl-md border border-zest-muted/20 bg-zest-card px-3.5 py-2.5 text-zest-muted text-sm">
                    Support is typing...
                  </div>
                </div>
              )}
              <div ref={scrollRef} />
            </div>

              <form
                onSubmit={(event) => {
                  event.preventDefault();
                  if (!canSend) {
                  showToast('Please type a message', 'error');
                  return;
                }
                handleSendMessage(messageInput);
              }}
              className="fixed bottom-0 left-0 right-0 z-40 p-3 pb-[calc(env(safe-area-inset-bottom)+12px)] border-t border-zest-muted/10 bg-zest-card/95 backdrop-blur-md md:sticky md:bottom-0 md:p-4 md:pb-4 md:bg-zest-card"
              >
                <div className="max-w-6xl mx-auto flex items-center gap-2">
                  <input
                  type="text"
                  value={messageInput}
                  onChange={(event) => setMessageInput(event.target.value)}
                  placeholder="Write your message..."
                  className="flex-1 h-11 rounded-2xl border border-zest-muted/20 bg-zest-dark/30 px-4 text-sm text-zest-text placeholder-zest-muted focus:outline-none focus:border-zest-orange focus:ring-2 focus:ring-zest-orange/20"
                />
                  <button
                    type="submit"
                    className="h-11 min-w-11 px-3 md:px-4 rounded-2xl bg-zest-orange text-white inline-flex items-center justify-center gap-2 font-semibold hover:bg-orange-600 transition-colors"
                  >
                    <FaPaperPlane />
                    <span className="hidden sm:inline">Send</span>
                </button>
              </div>
            </form>
          </section>
        </div>
      </div>
    </MainLayout>
  );
};

export default Support;
