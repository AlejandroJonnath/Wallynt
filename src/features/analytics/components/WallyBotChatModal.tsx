import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { theme } from '@shared/theme';
import { api } from '@core/api';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

interface WallyBotChatModalProps {
  visible: boolean;
  onClose: () => void;
  initialGreeting: string;
}

export function WallyBotChatModal({ visible, onClose, initialGreeting }: WallyBotChatModalProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    if (visible && messages.length === 0 && initialGreeting) {
      setMessages([
        { id: Date.now().toString(), role: 'assistant', content: initialGreeting }
      ]);
    }
  }, [visible, initialGreeting]);

  const sendMessage = async () => {
    if (!inputText.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: inputText.trim(),
    };

    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInputText('');
    setIsTyping(true);

    try {
      // Formatear historial para enviar a Groq
      const history = updatedMessages.map(m => ({ role: m.role, content: m.content }));
      const response = await api.post('/analysis/chat', { history });

      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.data?.response || 'Ocurrió un error inesperado.',
      };

      setMessages(prev => [...prev, botMsg]);
    } catch (error) {
      console.log('Error de chat', error);
      const errorMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Hubo un problema de conexión. Intenta de nuevo más tarde.',
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
      <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <LinearGradient
          colors={['#0B202E', theme.colors.primary]}
          style={styles.container}
        >
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerTitleContainer}>
              <Text style={styles.headerEmoji}>🤖</Text>
              <View>
                <Text style={styles.headerTitle}>WallyBot</Text>
                <Text style={styles.headerSubtitle}>En línea</Text>
              </View>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color="#FFF" />
            </TouchableOpacity>
          </View>

          {/* Chat List */}
          <ScrollView
            ref={scrollViewRef}
            contentContainerStyle={styles.chatContainer}
            onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
          >
            {messages.map((msg) => (
              <View
                key={msg.id}
                style={[
                  styles.messageRow,
                  msg.role === 'user' ? styles.messageRowUser : styles.messageRowBot
                ]}
              >
                {msg.role === 'assistant' && (
                  <View style={styles.botAvatar}>
                    <Text style={{ fontSize: 16 }}>🤖</Text>
                  </View>
                )}
                <View
                  style={[
                    styles.bubble,
                    msg.role === 'user' ? styles.bubbleUser : styles.bubbleBot
                  ]}
                >
                  <Text style={[styles.bubbleText, msg.role === 'user' ? styles.bubbleTextUser : styles.bubbleTextBot]}>
                    {msg.content}
                  </Text>
                </View>
              </View>
            ))}

            {isTyping && (
              <View style={[styles.messageRow, styles.messageRowBot]}>
                <View style={styles.botAvatar}>
                  <Text style={{ fontSize: 16 }}>🤖</Text>
                </View>
                <View style={[styles.bubble, styles.bubbleBot, { paddingVertical: 10, paddingHorizontal: 15 }]}>
                  <ActivityIndicator size="small" color={theme.colors.accent} />
                </View>
              </View>
            )}
          </ScrollView>

          {/* Input Area */}
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.textInput}
              placeholder="Escribe tu ubicación o pregunta..."
              placeholderTextColor="rgba(255,255,255,0.4)"
              value={inputText}
              onChangeText={setInputText}
              multiline
            />
            <TouchableOpacity
              style={[styles.sendButton, !inputText.trim() && { opacity: 0.5 }]}
              onPress={sendMessage}
              disabled={!inputText.trim() || isTyping}
            >
              <Ionicons name="send" size={18} color="#0B202E" />
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: Platform.OS === 'ios' ? 50 : 20,
    paddingBottom: 15,
    paddingHorizontal: 20,
    backgroundColor: '#0B202E',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  headerEmoji: {
    fontSize: 24,
  },
  headerTitle: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
  },
  headerSubtitle: {
    color: theme.colors.light,
    fontSize: 12,
  },
  closeButton: {
    padding: 5,
  },
  chatContainer: {
    padding: 20,
    gap: 16,
    paddingBottom: 40,
  },
  messageRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    maxWidth: '85%',
  },
  messageRowUser: {
    alignSelf: 'flex-end',
  },
  messageRowBot: {
    alignSelf: 'flex-start',
    gap: 8,
  },
  botAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(239,188,117,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(239,188,117,0.3)',
  },
  bubble: {
    borderRadius: 20,
    padding: 14,
  },
  bubbleUser: {
    backgroundColor: theme.colors.secondary,
    borderBottomRightRadius: 4,
  },
  bubbleBot: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  bubbleText: {
    fontSize: 14,
    lineHeight: 20,
  },
  bubbleTextUser: {
    color: '#FFF',
  },
  bubbleTextBot: {
    color: 'rgba(255,255,255,0.9)',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    paddingBottom: Platform.OS === 'ios' ? 30 : 15,
    backgroundColor: '#0B202E',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.05)',
    gap: 10,
  },
  textInput: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.05)',
    color: '#FFF',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 12,
    minHeight: 45,
    maxHeight: 100,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  sendButton: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: theme.colors.accent,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
