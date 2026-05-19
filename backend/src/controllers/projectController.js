const supabase = require('../config/supabase');

const getProjects = async (req, res) => {
  const { data, error } = await supabase
    .from('projects')
    .select('*, clients(name), payments(*)')
    .order('created_at', { ascending: false });

  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
};

const getProjectById = async (req, res) => {
  const { id } = req.params;
  const { data, error } = await supabase
    .from('projects')
    .select('*, clients(*), payments(*)')
    .eq('id', id)
    .single();

  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
};

const createProject = async (req, res) => {
  const { 
    name, client_id, type, payment_cycle, 
    lead, server, repos, hosting 
  } = req.body;

  console.log('Inserting project:', { name, client_id, type, payment_cycle, lead, server, repos, hosting });

  const { data, error } = await supabase
    .from('projects')
    .insert([{ 
      name, client_id, type, payment_cycle, 
      lead, server, repos, hosting 
    }])
    .select();

  if (error) {
    console.error('Supabase Error:', error);
    return res.status(400).json({ error: error.message, details: error.details });
  }
  res.status(201).json(data[0]);
};

const updateProject = async (req, res) => {
  const { id } = req.params;
  const updates = req.body;
  const { data, error } = await supabase
    .from('projects')
    .update(updates)
    .eq('id', id)
    .select();

  if (error) return res.status(400).json({ error: error.message });
  res.json(data[0]);
};

const deleteProject = async (req, res) => {
  const { id } = req.params;
  const { error } = await supabase
    .from('projects')
    .delete()
    .eq('id', id);

  if (error) return res.status(400).json({ error: error.message });
  res.json({ message: 'Project deleted successfully' });
};

module.exports = {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject
};
