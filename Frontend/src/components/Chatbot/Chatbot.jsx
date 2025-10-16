import { useEffect, useRef, useState } from 'react';
import { FaComments, FaMicrophone, FaPaperPlane, FaTimes } from 'react-icons/fa';
import { useTheme } from '../../context/ThemeContext';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState(() => {
    const savedMessages = localStorage.getItem('chatbot-messages');
    return savedMessages ? JSON.parse(savedMessages) : [
      { id: 1, text: "Hi! 👋 Welcome to Fresh Fruits Store! How can I help you today?", sender: 'bot' }
    ];
  });
  const [inputMessage, setInputMessage] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [pendingCancellation, setPendingCancellation] = useState(null);
  const [userContext, setUserContext] = useState({ name: '', lastOrder: '', preferences: [] });
  const [conversationHistory, setConversationHistory] = useState([]);
  const messagesEndRef = useRef(null);
  const { isDarkMode, toggleTheme } = useTheme();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
    localStorage.setItem('chatbot-messages', JSON.stringify(messages));
    
    // Load user context
    const loggedInUser = localStorage.getItem('loggedInUser');
    if (loggedInUser && !userContext.name) {
      setUserContext(prev => ({ ...prev, name: loggedInUser }));
    }
  }, [messages]);

  // AI-like response generation
  const generateIntelligentResponse = (input, context) => {
    const currentTime = new Date().getHours();
    const userName = userContext.name || 'friend';
    
    // Time-based responses
    if (input.includes('good morning') && currentTime < 12) {
      return `🌅 Good morning ${userName}! Perfect time for fresh fruits to energize your day!`;
    }
    if (input.includes('good evening') && currentTime >= 17) {
      return `🌆 Good evening ${userName}! How about some healthy fruit snacks after a long day?`;
    }
    
    // Context-aware responses
    if (input.includes('recommend') || input.includes('suggest')) {
      const recommendations = getPersonalizedRecommendations();
      return `🤖 Based on your preferences, I recommend: ${recommendations}. Would you like to see these in our menu?`;
    }
    
    // Mood detection
    if (input.includes('sad') || input.includes('tired') || input.includes('stressed')) {
      return `😊 I understand you're feeling down. Fresh fruits can boost your mood! Try our sweet oranges or energizing apples. They're natural mood lifters! 🍊🍎`;
    }
    
    if (input.includes('happy') || input.includes('excited') || input.includes('great') || input.includes('good') || input.includes('feeling good') || input.includes('awesome') || input.includes('fantastic')) {
      return `🎉 That's wonderful to hear ${userName}! Your positive energy is contagious! How about celebrating with some delicious fresh fruits? 🍎✨`;
    }
    
    return null;
  };

  const getPersonalizedRecommendations = () => {
    const fruits = ['Fresh Apples', 'Sweet Oranges', 'Creamy Avocados', 'Juicy Cherries'];
    const randomFruits = fruits.sort(() => 0.5 - Math.random()).slice(0, 2);
    return randomFruits.join(' and ');
  };

  const analyzeUserIntent = (input) => {
    const intents = {
      greeting: ['hello', 'hi', 'hey', 'good morning', 'good evening'],
      ordering: ['order', 'buy', 'purchase', 'want to buy'],
      information: ['tell me', 'what is', 'how much', 'price', 'cost'],
      help: ['help', 'assist', 'support', 'problem'],
      compliment: ['good', 'great', 'awesome', 'excellent', 'amazing'],
      complaint: ['bad', 'terrible', 'awful', 'disappointed', 'problem']
    };
    
    for (const [intent, keywords] of Object.entries(intents)) {
      if (keywords.some(keyword => input.includes(keyword))) {
        return intent;
      }
    }
    return 'general';
  };

  const quickReplies = [
    "🔐 Login help",
    "🛒 How to order",
    "🍎 Show me fruits",
    "📞 Contact support"
  ];

  const botResponses = {
    "show me fruits": () => {
      setTimeout(() => {
        const menuSection = document.querySelector('#menu');
        if (menuSection) {
          menuSection.scrollIntoView({ behavior: 'smooth' });
        }
      }, 500);
      return "🍎 Taking you to our fresh fruits menu! We have apples, oranges, avocados, and cherries! 🚀";
    },
    "track my order": "📦 You can track your orders in the 'My Orders' section after logging in. Need help logging in?",
    "pricing info": "💰 Our fruits start from ₹134/kg. Prices vary by fruit type and weight. Check our menu for detailed pricing!",
    "contact support": "📞 You can reach us at support@freshfruits.com or call +91-9028676508. We're here 24/7!",
    "hello": "Hello! 👋 Welcome to Fresh Fruits Store! How can I assist you today?",
    "hi": "Hi there! 🌟 Looking for fresh fruits? I'm here to help!",
    "help": "🤝 I can help you with: \n• Fruit information \n• Order tracking \n• Pricing details \n• Support contact: +91-9028676508",
    "yes": async () => {
      if (pendingCancellation) {
        try {
          const token = localStorage.getItem('token');
          const response = await fetch(`http://localhost:8000/orders/cancel/${pendingCancellation}`, {
            method: 'PUT',
            headers: { 'Authorization': `Bearer ${token}` }
          });
          
          const result = await response.json();
          if (result.success) {
            setPendingCancellation(null);
            return `✅ Order #${pendingCancellation} has been cancelled successfully! \n\nYour refund will be processed within 3-5 business days.`;
          } else {
            setPendingCancellation(null);
            return `❌ Failed to cancel order: ${result.message}`;
          }
        } catch (error) {
          setPendingCancellation(null);
          return "❌ Error cancelling order. Please try again.";
        }
      } else {
        return "🔐 To login: \n1. Click the user icon in navbar \n2. Enter your email & password \n3. Click 'Sign In' \n\nForgot password? Click 'Forgot Password' link!";
      }
    },
    "login help": "🔐 Login Steps: \n1. Click user icon (👤) in top navbar \n2. Enter registered email \n3. Enter your password \n4. Click 'Sign In' button \n\nTrouble? Try 'Forgot Password' option!",
    "forgot password": "🔑 Reset Password: \n1. Click 'Forgot Password' on login page \n2. Enter your email \n3. Check email for OTP \n4. Enter OTP & new password \n\nStill stuck? Contact support!",
    "how can i order my fruits": () => {
      setTimeout(() => {
        const menuSection = document.querySelector('#menu');
        if (menuSection) {
          menuSection.scrollIntoView({ behavior: 'smooth' });
        }
      }, 500);
      return "🛒 Taking you to our fruits menu! Here's how to order: \n1. Select quantity & weight \n2. Click 'Add to Cart' \n3. Login if needed \n4. Checkout & enjoy! 🚀";
    },
    "how can i order fruits": () => {
      setTimeout(() => {
        const menuSection = document.querySelector('#menu');
        if (menuSection) {
          menuSection.scrollIntoView({ behavior: 'smooth' });
        }
      }, 500);
      return "🛒 Redirecting to fruits menu! Follow these steps to order fresh fruits! 🚀";
    },
    "how to order": "🛒 How to Order: \n1. Browse our menu \n2. Select quantity & weight \n3. Click 'Add to Cart' \n4. Login if needed \n5. Go to cart & checkout \n6. Fill delivery details \n7. Choose payment method",
    "payment methods": "💳 We accept: \n• Cash on Delivery (COD) \n• UPI Payment \n• Credit/Debit Cards \n\nAll payments are secure!",
    "delivery": "🚚 Delivery Info: \n• Free delivery above ₹500 \n• Same day delivery available \n• Fresh fruits guaranteed \n• Track your order online",
    "switch to night mode": () => {
      if (!isDarkMode) {
        toggleTheme();
        return "🌙 Night mode activated! Dark theme is now on.";
      }
      return "🌙 Night mode is already on!";
    },
    "switch to light mode": () => {
      if (isDarkMode) {
        toggleTheme();
        return "☀️ Light mode activated! Bright theme is now on.";
      }
      return "☀️ Light mode is already on!";
    },
    "night mode on": () => {
      if (!isDarkMode) {
        toggleTheme();
        return "🌙 Night mode activated! Dark theme is now on.";
      }
      return "🌙 Night mode is already on!";
    },
    "night mode off": () => {
      if (isDarkMode) {
        toggleTheme();
        return "☀️ Light mode activated! Bright theme is now on.";
      }
      return "☀️ Light mode is already on!";
    },
    "dark mode": () => {
      if (!isDarkMode) {
        toggleTheme();
        return "🌙 Dark mode activated!";
      }
      return "🌙 Dark mode is already on!";
    },
    "light mode": () => {
      if (isDarkMode) {
        toggleTheme();
        return "☀️ Light mode activated!";
      }
      return "☀️ Light mode is already on!";
    },
    "clear chat history": () => {
      const defaultMessages = [
        { id: 1, text: "Hi! 👋 Welcome to Fresh Fruits Store! How can I help you today?", sender: 'bot' }
      ];
      setMessages(defaultMessages);
      localStorage.setItem('chatbot-messages', JSON.stringify(defaultMessages));
      return "🧹 Chat history cleared! Starting fresh.";
    },
    "clear chat": () => {
      const defaultMessages = [
        { id: 1, text: "Hi! 👋 Welcome to Fresh Fruits Store! How can I help you today?", sender: 'bot' }
      ];
      setMessages(defaultMessages);
      localStorage.setItem('chatbot-messages', JSON.stringify(defaultMessages));
      return "🧹 Chat cleared! Ready for new conversation.";
    },
    "reset chat": () => {
      const defaultMessages = [
        { id: 1, text: "Hi! 👋 Welcome to Fresh Fruits Store! How can I help you today?", sender: 'bot' }
      ];
      setMessages(defaultMessages);
      localStorage.setItem('chatbot-messages', JSON.stringify(defaultMessages));
      return "🔄 Chat reset! Let's start over.";
    },
    "clear my all chat history": () => {
      const defaultMessages = [
        { id: 1, text: "Hi! 👋 Welcome to Fresh Fruits Store! How can I help you today?", sender: 'bot' }
      ];
      setMessages(defaultMessages);
      localStorage.setItem('chatbot-messages', JSON.stringify(defaultMessages));
      return "🧹 All chat history cleared! Fresh start activated.";
    },
    "clear all chat": () => {
      const defaultMessages = [
        { id: 1, text: "Hi! 👋 Welcome to Fresh Fruits Store! How can I help you today?", sender: 'bot' }
      ];
      setMessages(defaultMessages);
      localStorage.setItem('chatbot-messages', JSON.stringify(defaultMessages));
      return "🧹 All conversations cleared! Ready for new chat.";
    },
    "clear my all chats": () => {
      const defaultMessages = [
        { id: 1, text: "Hi! 👋 Welcome to Fresh Fruits Store! How can I help you today?", sender: 'bot' }
      ];
      setMessages(defaultMessages);
      localStorage.setItem('chatbot-messages', JSON.stringify(defaultMessages));
      return "🧹 All your chats cleared! Fresh conversation started.";
    },
    "clear all chats": () => {
      const defaultMessages = [
        { id: 1, text: "Hi! 👋 Welcome to Fresh Fruits Store! How can I help you today?", sender: 'bot' }
      ];
      setMessages(defaultMessages);
      localStorage.setItem('chatbot-messages', JSON.stringify(defaultMessages));
      return "🧹 All chats cleared! Starting fresh conversation.";
    },
    "thank you": "😊 You're welcome! Happy to help you with fresh fruits! Is there anything else you need?",
    "thanks": "😊 My pleasure! Enjoy your fresh fruits shopping experience! 🍎",
    "thank you jarvis": "😊 You're most welcome! I'm always here to help you with fresh fruits and more! 🤖🍏",
    "thanks jarvis": "😊 Anytime! Feel free to ask me anything about our fresh fruits store! 🍊🍋",
    "redirect me to my orders": () => {
      setTimeout(() => {
        window.location.href = '/my-orders';
      }, 500);
      return "📦 Redirecting you to My Orders page! 🚀";
    },
    "take me to my orders": () => {
      setTimeout(() => {
        window.location.href = '/my-orders';
      }, 500);
      return "📦 Taking you to your orders! 🚀";
    },
    "show my orders": () => {
      setTimeout(() => {
        window.location.href = '/my-orders';
      }, 500);
      return "📦 Opening your orders page! 🚀";
    },
    "go to my orders": () => {
      setTimeout(() => {
        window.location.href = '/my-orders';
      }, 500);
      return "📦 Navigating to My Orders! 🚀";
    },
    "go back to the home page": () => {
      setTimeout(() => {
        window.location.replace('/');
      }, 500);
      return "🏠 Taking you back to home page! 🚀";
    },
    "go to home page": () => {
      setTimeout(() => {
        window.location.replace('/');
      }, 500);
      return "🏠 Redirecting to home! 🚀";
    },
    "take me home": () => {
      setTimeout(() => {
        window.location.replace('/');
      }, 500);
      return "🏠 Going home! 🚀";
    },
    "go home": () => {
      setTimeout(() => {
        window.location.replace('/');
      }, 500);
      return "🏠 Navigating to home page! 🚀";
    },
    "go back to the homepage": () => {
      setTimeout(() => {
        window.location.replace('/');
      }, 500);
      return "🏠 Taking you back to homepage! 🚀";
    },
    "go to homepage": () => {
      setTimeout(() => {
        window.location.replace('/');
      }, 500);
      return "🏠 Redirecting to homepage! 🚀";
    },
    "take me to my cart": () => {
      setTimeout(() => {
        window.location.href = '/cart';
      }, 500);
      return "🛒 Taking you to your cart! 🚀";
    },
    "go to my cart": () => {
      setTimeout(() => {
        window.location.href = '/cart';
      }, 500);
      return "🛒 Redirecting to cart! 🚀";
    },
    "show my cart": () => {
      setTimeout(() => {
        window.location.href = '/cart';
      }, 500);
      return "🛒 Opening your cart! 🚀";
    },
    "open cart": () => {
      setTimeout(() => {
        window.location.href = '/cart';
      }, 500);
      return "🛒 Opening cart page! 🚀";
    },
    "redirect me to cart": () => {
      setTimeout(() => {
        window.location.href = '/cart';
      }, 500);
      return "🛒 Redirecting you to cart! 🚀";
    },
    "go to cart": () => {
      setTimeout(() => {
        window.location.href = '/cart';
      }, 500);
      return "🛒 Going to cart! 🚀";
    },
    "i'm feeling good today": () => {
      const userName = userContext.name || 'friend';
      const responses = [
        `🎉 That's amazing ${userName}! Good vibes deserve good fruits! How about some sweet oranges to match your mood? 🍊✨`,
        `😊 Fantastic ${userName}! Positive energy calls for positive nutrition! Try our fresh apples for an extra boost! 🍎💪`,
        `✨ Love the good energy ${userName}! Let's keep it going with some delicious fresh fruits! What sounds good? 🍎🍊`,
        `🌈 Great to hear ${userName}! Good days deserve good treats! Check out our fresh fruit collection! 🍒🥑`
      ];
      setTimeout(() => {
        const menuSection = document.querySelector('#menu');
        if (menuSection) {
          menuSection.scrollIntoView({ behavior: 'smooth' });
        }
      }, 500);
      return responses[Math.floor(Math.random() * responses.length)];
    },
    "feeling good": () => {
      const userName = userContext.name || 'friend';
      return `😊 That's wonderful ${userName}! Good feelings deserve good fruits! What would you like to try today? 🍎🍊🥑🍒`;
    },
    "i'm happy": () => {
      const userName = userContext.name || 'friend';
      return `😄 Your happiness makes my day ${userName}! Happy people deserve happy fruits! Let me show you our sweetest options! 🍭🍎`;
    },
    "i need some fresh fruits": () => {
      setTimeout(() => {
        const menuSection = document.querySelector('#menu');
        if (menuSection) {
          menuSection.scrollIntoView({ behavior: 'smooth' });
        }
      }, 500);
      return "🍎 Perfect! Taking you to our fresh fruits menu! Choose from apples, oranges, avocados, and cherries! 🚀";
    },
    "need fresh fruits": () => {
      setTimeout(() => {
        const menuSection = document.querySelector('#menu');
        if (menuSection) {
          menuSection.scrollIntoView({ behavior: 'smooth' });
        }
      }, 500);
      return "🍎 Great choice! Here are our fresh fruits! 🚀";
    },
    "want fresh fruits": () => {
      setTimeout(() => {
        const menuSection = document.querySelector('#menu');
        if (menuSection) {
          menuSection.scrollIntoView({ behavior: 'smooth' });
        }
      }, 500);
      return "🍎 Excellent! Browse our fresh fruit collection! 🚀";
    },
    "how are you": "🤖 I'm doing great! Ready to help you with fresh fruits and anything else you need! How are you doing today?",
    "how are you jarvis": "🤖 I'm fantastic! Always excited to help customers find the best fresh fruits! How can I assist you today?",
    "good morning": "🌅 Good morning! Hope you have a wonderful day ahead! Looking for some fresh fruits to start your day?",
    "good afternoon": "☀️ Good afternoon! Perfect time for some healthy fruit snacks! What can I help you with?",
    "good evening": "🌆 Good evening! How was your day? Need some fresh fruits for dinner or tomorrow?",
    "good night": "🌙 Good night! Sweet dreams! Don't forget to order fresh fruits for tomorrow! 😴",
    "bye": "👋 Goodbye! Thanks for visiting Fresh Fruits Store! Come back soon for more delicious fruits!",
    "goodbye": "👋 Goodbye! Have a great day and enjoy your fresh fruits! See you again soon!",
    "see you later": "👋 See you later! Take care and don't forget about our fresh fruit deals!",
    "what's up": "😄 Hey there! Just here helping customers find the freshest fruits! What's up with you?",
    "how's it going": "😊 It's going great! Busy helping fruit lovers like you! How's your day going?",
    "nice to meet you": "🤝 Nice to meet you too! Welcome to Fresh Fruits Store! I'm Jarvis, your fruit assistant!",
    "what's your name": "🤖 I'm Jarvis, your friendly Fresh Fruits Store assistant! Nice to meet you!",
    "who are you": "🤖 I'm Jarvis! Your personal AI assistant for Fresh Fruits Store. I'm here to help you with everything fruit-related!",
    "how old are you": "🤖 I'm as fresh as our fruits! Just created to help you have the best fruit shopping experience!",
    "where are you from": "🍎 I'm from the digital world of Fresh Fruits Store! Born to serve you the best fruits!",
    "what can you do": "🤖 I can help you with: \n• Find fresh fruits \n• Place orders \n• Track deliveries \n• Answer questions \n• Control themes \n• Navigate pages \n• Have friendly chats!",
    "you're awesome": "😊 Aww, thank you! You're awesome too! Now let's find you some awesome fresh fruits!",
    "you're cool": "😎 Thanks! I try to be as cool as our refrigerated fruits! 🍎❄️",
    "i love you": "😊 That's sweet! I love helping you with fresh fruits! 🍍❤️",
    "cancel my order": async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          return "🔐 Please login first to cancel your order!";
        }
        
        const response = await fetch('http://localhost:8000/orders/user-orders', {
          method: 'GET',
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        const result = await response.json();
        if (result.success && result.orders.length > 0) {
          const pendingOrders = result.orders.filter(order => 
            order.status === 'pending' || order.status === 'confirmed'
          );
          const cancelledOrders = result.orders.filter(order => order.status === 'cancelled');
          
          if (pendingOrders.length === 0) {
            if (cancelledOrders.length > 0) {
              return `✅ Your recent order #${cancelledOrders[0].orderId} is already cancelled! \n\nRefund status: Processing \nExpected refund: 3-5 business days`;
            }
            return "❌ No cancellable orders found! Only pending/confirmed orders can be cancelled.";
          }
          
          const latestOrder = pendingOrders[0];
          setPendingCancellation(latestOrder.orderId);
          return `❓ Are you sure you want to cancel Order #${latestOrder.orderId}? \n\nOrder Total: ₹${latestOrder.totalAmount} \nStatus: ${latestOrder.status} \n\nReply 'yes' to confirm or 'no' to keep the order.`;
        } else {
          return "❌ No orders found to cancel!";
        }
      } catch (error) {
        return "❌ Error fetching orders. Please try again later.";
      }
    },
    "cancel order": async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          return "🔐 Please login first to cancel your order!";
        }
        
        const response = await fetch('http://localhost:8000/orders/user-orders', {
          method: 'GET',
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        const result = await response.json();
        if (result.success && result.orders.length > 0) {
          const pendingOrders = result.orders.filter(order => 
            order.status === 'pending' || order.status === 'confirmed'
          );
          const cancelledOrders = result.orders.filter(order => order.status === 'cancelled');
          
          if (pendingOrders.length === 0) {
            if (cancelledOrders.length > 0) {
              return `✅ Order #${cancelledOrders[0].orderId} is already cancelled!`;
            }
            return "❌ No cancellable orders found!";
          }
          
          const latestOrder = pendingOrders[0];
          setPendingCancellation(latestOrder.orderId);
          return `❓ Confirm cancellation of Order #${latestOrder.orderId}? \n\nReply 'yes' to cancel or 'no' to keep it.`;
        } else {
          return "❌ No orders found!";
        }
      } catch (error) {
        return "❌ Error occurred. Please try again.";
      }
    },
    "how to cancel order": "To cancel your order: \n1. Go to 'My Orders' section \n2. Find your pending order \n3. Click 'Cancel Order' button \n4. Confirm cancellation \n\nNote: Only pending/confirmed orders can be cancelled!",
    "no": () => {
      if (pendingCancellation) {
        setPendingCancellation(null);
        return "👍 Order kept! Your order is safe and will be processed as scheduled. \n\nIs there anything else I can help you with?";
      } else {
        return "👍 Okay! Is there anything else I can help you with?";
      }
    },
    "cancel my recent order": async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          return "🔐 Please login first!";
        }
        
        const response = await fetch('http://localhost:8000/orders/user-orders', {
          method: 'GET',
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        const result = await response.json();
        if (result.success && result.orders.length > 0) {
          const latestOrder = result.orders[0];
          if (latestOrder.status === 'pending' || latestOrder.status === 'confirmed') {
            setPendingCancellation(latestOrder.orderId);
            return `❓ Cancel your most recent Order #${latestOrder.orderId}? \n\nTotal: ₹${latestOrder.totalAmount} \n\nReply 'yes' to confirm cancellation.`;
          } else {
            return "❌ Your recent order cannot be cancelled as it's already ${latestOrder.status}.";
          }
        } else {
          return "❌ No recent orders found!";
        }
      } catch (error) {
        return "❌ Error fetching recent order.";
      }
    },
    "what's the weather": () => {
      const responses = [
        "🌤️ I don't have weather data, but I know fresh fruits are perfect for any weather! Oranges for sunny days, apples for cool weather!",
        "☀️ Whatever the weather, fresh fruits keep you healthy! How about some vitamin C rich oranges?"
      ];
      return responses[Math.floor(Math.random() * responses.length)];
    },
    "tell me a joke": () => {
      const jokes = [
        "🍎 Why did the apple go to the gym? To get some core strength! 😄",
        "🍊 What do you call a sad orange? A blue-orange! 😂",
        "🥑 Why don't avocados ever feel lonely? Because they're always in a bunch! 🤣",
        "🍒 What's a cherry's favorite music? Pit-stop! 🎵",
        "🍎 What did the apple say to the orange? You're a-peel-ing! 😆",
        "🍊 Why did the orange stop rolling down the hill? It ran out of juice! 😂",
        "🥑 What do you call an avocado that's been blessed? Holy guacamole! 😇",
        "🍒 Why are cherries never lonely? They hang out in pairs! 😊",
        "🍎 What's an apple's favorite type of music? Rock and roll! 🎸",
        "🍊 How do you make an orange laugh? Tell it a citrus joke! 😄",
        "🥑 Why did the avocado break up with the toast? It was getting too spread out! 😅",
        "🍒 What do you call a cherry that won't leave you alone? A pest-cherry! 😜"
      ];
      return jokes[Math.floor(Math.random() * jokes.length)];
    },
    "more jokes": () => {
      const jokes = [
        "🍎 Why don't apples ever get speeding tickets? They always stick to the core speed limit! 😂",
        "🍊 What's orange and sounds like a parrot? A carrot! Wait, that's not a fruit... 😅",
        "🥑 Why did the avocado go to therapy? It had too many layers to peel back! 😌",
        "🍒 What do you call a cherry that's good at karate? A cherry-chop! 🥋",
        "🍎 Why was the apple embarrassed? It saw the salad dressing! 😳",
        "🍊 What did the orange say when it won the lottery? I'm rich in Vitamin C! 💰"
      ];
      return jokes[Math.floor(Math.random() * jokes.length)];
    },
    "another joke": () => {
      const jokes = [
        "🍎 What do you call an apple that plays the trumpet? A tooty fruity! 🎺",
        "🍊 Why don't oranges ever win races? They always get squeezed at the finish line! 🏃",
        "🥑 What's an avocado's favorite day? Fry-day! Because guac and fries! 🍟",
        "🍒 Why are cherries so good at math? They know how to count in pairs! 🔢"
      ];
      return jokes[Math.floor(Math.random() * jokes.length)];
    },
    "i want more jokes": () => {
      const jokes = [
        "🍎 What's the difference between an apple and a computer? You can't byte an apple! 💻",
        "🍊 Why did the orange go to the doctor? It wasn't peeling well! 🩹",
        "🥑 What do you call an avocado that's a detective? Sherlock Guac! 🕵️",
        "🍒 Why don't cherries ever tell secrets? They might spill the pits! 🤫",
        "🍎 What did the apple teacher say to her students? You're all the apple of my eye! 👁️",
        "🍊 How do you fix a broken orange? With orange juice concentrate! 🧘"
      ];
      return jokes[Math.floor(Math.random() * jokes.length)];
    },
    "recommend me something": () => {
      const recommendations = getPersonalizedRecommendations();
      setTimeout(() => {
        const menuSection = document.querySelector('#menu');
        if (menuSection) {
          menuSection.scrollIntoView({ behavior: 'smooth' });
        }
      }, 500);
      return `🤖 Perfect! I recommend ${recommendations} based on popularity and nutritional value. Taking you to our menu! 🚀`;
    },
    "what's your favorite fruit": "🤖 As an AI, I don't eat, but if I could, I'd love apples! They're crunchy, sweet, and full of data... I mean nutrients! 🍎😄",
    "are you real": "🤖 I'm as real as your craving for fresh fruits! I'm an AI assistant, but my care for your fruit needs is 100% genuine! ✨",
    "what time is it": () => {
      const now = new Date();
      const time = now.toLocaleTimeString();
      return `🕐 It's ${time}! Perfect time for a healthy fruit snack! What would you like to try?`;
    },
    "i'm hungry": () => {
      setTimeout(() => {
        const menuSection = document.querySelector('#menu');
        if (menuSection) {
          menuSection.scrollIntoView({ behavior: 'smooth' });
        }
      }, 500);
      return "🍽️ Perfect timing! Fresh fruits are the best healthy snack. Let me show you our delicious options! 🚀";
    },
    "i'm thirsty": "🥤 Fresh fruits are great for hydration too! Oranges and apples have high water content. Much better than sugary drinks! 💧",
    "default": () => {
      const userName = userContext.name ? ` ${userContext.name}` : '';
      const responses = [
        `🤖 Hi${userName}! I can help with: \n• Fresh fruit recommendations \n• Order assistance \n• Nutritional info \n• Fun fruit facts \n• Theme control \n\nWhat interests you today?`,
        `🍎 Hey${userName}! I'm your intelligent fruit assistant! Ask me about our fruits, place orders, or just chat! What's on your mind?`,
        `✨ Hello${userName}! I'm here to make your fruit shopping experience amazing! Need help with anything specific?`
      ];
      return responses[Math.floor(Math.random() * responses.length)];
    }
  };

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    const userMessage = { id: Date.now(), text: inputMessage, sender: 'user' };
    setMessages(prev => [...prev, userMessage]);

    // Bot response
    setTimeout(() => {
      const lowerInput = inputMessage.toLowerCase().replace(/🔐|🛒|🍎|📞/g, '').trim();
      let botResponse = botResponses.default;
      
      // Check for specific phrases first (longer matches first)
      const sortedKeys = Object.keys(botResponses).sort((a, b) => b.length - a.length);
      
      // Try intelligent response first
      const intelligentResponse = generateIntelligentResponse(lowerInput, userContext);
      if (intelligentResponse) {
        botResponse = intelligentResponse;
      } else {
        // Fallback to keyword matching
        for (const key of sortedKeys) {
          if (lowerInput.includes(key)) {
            const response = botResponses[key];
            if (typeof response === 'function') {
              const result = response();
              if (result instanceof Promise) {
                result.then(asyncResponse => {
                  const asyncBotMessage = { id: Date.now() + 2, text: asyncResponse, sender: 'bot' };
                  setMessages(prev => [...prev, asyncBotMessage]);
                });
                botResponse = "🔄 Processing your request...";
              } else {
                botResponse = result;
              }
            } else {
              botResponse = response;
            }
            break;
          }
        }
      }
      
      // Learn from conversation
      setConversationHistory(prev => [...prev.slice(-10), { input: lowerInput, response: botResponse, timestamp: Date.now() }]);

      const botMessage = { id: Date.now() + 1, text: botResponse, sender: 'bot' };
      setMessages(prev => [...prev, botMessage]);
    }, 1000);

    setInputMessage('');
  };

  const handleQuickReply = (reply) => {
    setInputMessage(reply);
    setTimeout(() => handleSendMessage(), 100);
  };

  const startVoiceRecognition = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Voice recognition not supported in this browser!');
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript.toLowerCase();
      
      const userMessage = { id: Date.now(), text: transcript, sender: 'user' };
      setMessages(prev => [...prev, userMessage]);
      
      setTimeout(() => {
        // Clean transcript by removing common words  
        const cleanTranscript = transcript.replace(/hey|please|can you|could you|ok|how can|redirect me to|take me to|show|go to|go back to the|take me|how are you|what's|who are you|where are you|how old are you|cancel my|how to|show my|open|yes i|i need some|need|want|go back to the|clear my all|clear all|tell me|i want|another/g, '').trim();
        
        const sortedKeys = Object.keys(botResponses).sort((a, b) => b.length - a.length);
        let botResponse = botResponses.default;
        
        for (const key of sortedKeys) {
          if (cleanTranscript.includes(key) || transcript.includes(key)) {
            const response = botResponses[key];
            if (typeof response === 'function') {
              const result = response();
              if (result instanceof Promise) {
                result.then(asyncResponse => {
                  const asyncBotMessage = { id: Date.now() + 2, text: asyncResponse, sender: 'bot' };
                  setMessages(prev => [...prev, asyncBotMessage]);
                });
                botResponse = "🔄 Processing your request...";
              } else {
                botResponse = result;
              }
            } else {
              botResponse = response;
            }
            break;
          }
        }

        const botMessage = { id: Date.now() + 1, text: botResponse, sender: 'bot' };
        setMessages(prev => [...prev, botMessage]);
      }, 1000);
    };

    recognition.onerror = () => {
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  return (
    <>
      {/* Chat Button */}
      <div className="fixed bottom-6 right-6 z-[9999]">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white p-4 rounded-full shadow-2xl transition-all duration-300 transform hover:scale-110"
        >
          {isOpen ? <FaTimes className="text-xl" /> : <FaComments className="text-xl" />}
        </button>
      </div>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-80 sm:w-96 h-96 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl z-[9999] flex flex-col transition-all duration-300 border border-gray-200 dark:border-gray-600">
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-4 rounded-t-2xl">
            <h3 className="font-bold text-lg">I'm Jarvis</h3>
            <p className="text-sm opacity-90">🤖 Fresh Fruits Assistant</p>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs px-4 py-2 rounded-2xl ${
                    message.sender === 'user'
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white'
                  }`}
                >
                  <p className="text-sm whitespace-pre-line">{message.text}</p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Replies */}
          <div className="px-4 py-2">
            <div className="flex flex-wrap gap-2">
              {quickReplies.map((reply, index) => (
                <button
                  key={index}
                  onClick={() => handleQuickReply(reply)}
                  className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-3 py-1 rounded-full hover:bg-purple-100 dark:hover:bg-purple-800 transition-colors duration-200"
                >
                  {reply}
                </button>
              ))}
            </div>
          </div>

          {/* Input */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-600">
            <div className="flex gap-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Type your message..."
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
              <button
                onClick={startVoiceRecognition}
                className={`${isListening ? 'bg-red-500 animate-pulse' : 'bg-blue-500 hover:bg-blue-600'} text-white p-2 rounded-xl transition-all duration-200 mr-2`}
                title="Voice Input"
              >
                <FaMicrophone />
              </button>
              <button
                onClick={handleSendMessage}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white p-2 rounded-xl transition-all duration-200"
              >
                <FaPaperPlane />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot;