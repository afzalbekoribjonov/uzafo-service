const supabase = require('../config/supabase');

const getMessages = async (req, res) => {
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
};

const createMessage = async (req, res) => {
  const { email, content } = req.body;
  const { data, error } = await supabase
    .from('messages')
    .insert([{ email, content }])
    .select();

  if (error) return res.status(400).json({ error: error.message });
  res.status(201).json(data[0]);
};

const markAsRead = async (req, res) => {
  const { id } = req.params;
  const { data, error } = await supabase
    .from('messages')
    .update({ is_read: true })
    .eq('id', id)
    .select();

  if (error) return res.status(400).json({ error: error.message });
  res.json(data[0]);
};

const deleteMessage = async (req, res) => {
  const { id } = req.params;
  const { error } = await supabase
    .from('messages')
    .delete()
    .eq('id', id);

  if (error) return res.status(400).json({ error: error.message });
  res.json({ message: 'Message deleted successfully' });
};

module.exports = {
  getMessages,
  createMessage,
  markAsRead,
  deleteMessage
};
