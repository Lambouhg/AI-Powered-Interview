import { getAIResponse } from '@/services/azureAiService';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { message } = req.body;
    
    if (!message) {
      return res.status(400).json({ message: 'Message is required' });
    }
    
    // Gọi hàm getAIResponse để thử kết nối với Azure OpenAI
    const response = await getAIResponse(message, [], { position: 'Frontend Developer' });
    
    return res.status(200).json({ 
      success: true, 
      message: response,
      isMock: false
    });
  } catch (error) {
    console.error('Error testing Azure AI:', error);
    return res.status(500).json({ 
      success: false, 
      message: error.message || 'Error processing request',
      isMock: true
    });
  }
}
