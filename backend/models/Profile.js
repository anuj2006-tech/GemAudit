/**
 * Profile Model
 * Handles database operations for user profiles in Supabase
 */

export const createProfile = async (supabase, { id, email, name, role }) => {
  const { data, error } = await supabase
    .from('profiles')
    .insert({
      id,
      email: email.toLowerCase(),
      name,
      role
    })
    .select()
    .single();

  if (error) {
    throw new Error(`Profile creation database error: ${error.message}`);
  }
  return data;
};

export const getProfileById = async (supabase, id) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    throw new Error(`Get profile database error: ${error.message}`);
  }
  return data;
};

export const getAllLegalAdmins = async (supabase) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('role', 'legal-admin')
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(`Fetch legal admins database error: ${error.message}`);
  }
  return data;
};
