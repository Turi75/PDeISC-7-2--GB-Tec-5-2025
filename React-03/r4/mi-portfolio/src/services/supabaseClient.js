import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ywkunlmzfmcoevcvluiz.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl3a3VubG16Zm1jb2V2Y3ZsdWl6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYzMjgzNjAsImV4cCI6MjA3MTkwNDM2MH0.erC4CCOqjBZNHjLEyimXI4gwuSyVSsEhQKyh-A1qL7w'

export const supabase = createClient(supabaseUrl, supabaseKey)