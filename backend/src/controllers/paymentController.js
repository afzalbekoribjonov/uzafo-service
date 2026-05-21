const supabase = require('../config/supabase');

const getPayments = async (req, res) => {
  const { data, error } = await supabase
    .from('payments')
    .select('*, projects(name)')
    .order('paid_at', { ascending: false });

  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
};

const createPayment = async (req, res) => {
  const { project_id, amount, currency, cycle, paid_at } = req.body;
  
  // Default values and validation
  const finalCycle = cycle || 'monthly';
  const finalCurrency = currency || 'UZS';

  const { data, error } = await supabase
    .from('payments')
    .insert([{ 
      project_id, 
      amount, 
      currency: finalCurrency, 
      cycle: finalCycle, 
      paid_at 
    }])
    .select();

  if (error) {
    console.error('Supabase Error:', error);
    return res.status(400).json({ error: error.message, details: error.details });
  }
  res.status(201).json(data[0]);
};

const updatePayment = async (req, res) => {
  const { id } = req.params;
  const { amount, currency, cycle, paid_at } = req.body;

  const { data, error } = await supabase
    .from('payments')
    .update({ amount, currency, cycle, paid_at })
    .eq('id', id)
    .select();

  if (error) return res.status(400).json({ error: error.message });
  res.json(data[0]);
};

const deletePayment = async (req, res) => {
  const { id } = req.params;

  const { error } = await supabase
    .from('payments')
    .delete()
    .eq('id', id);

  if (error) return res.status(400).json({ error: error.message });
  res.status(204).send();
};

const getPublicReceipt = async (req, res) => {
  const { id } = req.params;

  console.log(`Fetching public receipt for ID: ${id}`);

  const { data, error } = await supabase
    .from('payments')
    .select('*, projects(*, clients(*))')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Supabase Error in getPublicReceipt:', error);
    return res.status(404).json({ error: 'Chek topilmadi', details: error.message });
  }
  
  if (!data) {
    console.log('No receipt found for ID:', id);
    return res.status(404).json({ error: 'Chek topilmadi' });
  }
  
  res.json(data);
};

module.exports = {
  getPayments,
  getPublicReceipt,
  createPayment,
  updatePayment,
  deletePayment
};
