const supabase = require('../config/supabase');

const getClients = async (req, res) => {
  const { data, error } = await supabase
    .from('clients')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
};

const getClientById = async (req, res) => {
  const { id } = req.params;
  const { data, error } = await supabase
    .from('clients')
    .select('*, projects(*)')
    .eq('id', id)
    .single();

  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
};

const getPublicClientBySlug = async (req, res) => {
  const { slug } = req.params;
  
  const { data, error } = await supabase
    .from('clients')
    .select(`
      id, name, slug,
      projects (
        id, name, type, payment_cycle, 
        payments (id, amount, currency, cycle, paid_at)
      )
    `)
    .eq('slug', slug.toLowerCase())
    .single();

  if (error || !data) return res.status(404).json({ error: 'Mijoz topilmadi' });
  
  res.json(data);
};

const createClient = async (req, res) => {
  const { name, slug, phone, email } = req.body;
  const { data, error } = await supabase
    .from('clients')
    .insert([{ name, slug, phone, email }])
    .select();

  if (error) return res.status(400).json({ error: error.message });
  res.status(201).json(data[0]);
};

const updateClient = async (req, res) => {
  const { id } = req.params;
  const { name, slug, phone, email } = req.body;
  const { data, error } = await supabase
    .from('clients')
    .update({ name, slug, phone, email })
    .eq('id', id)
    .select();

  if (error) return res.status(400).json({ error: error.message });
  res.json(data[0]);
};

const deleteClient = async (req, res) => {
  const { id } = req.params;
  const { error } = await supabase
    .from('clients')
    .delete()
    .eq('id', id);

  if (error) return res.status(400).json({ error: error.message });
  res.json({ message: 'Client deleted successfully' });
};

module.exports = {
  getClients,
  getClientById,
  createClient,
  updateClient,
  deleteClient
};
