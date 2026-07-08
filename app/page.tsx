import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';

export default async function Index() {
  // If your createClient utilities follow the standard Supabase SSR package, 
  // it is usually an async function or requires awaiting the client.
  const supabase = await createClient();

  // Use getUser() instead of getSession() for security and accuracy on the server
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    redirect('/login');
  }

  redirect('/dashboard');
}