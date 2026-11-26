/* Functional Foundations config. The anon key is the project's PUBLIC key (the same one the 22-Day app ships).
 * It can only call public.foundations_join(); the table itself is closed to the public. Never put a secret here. */
window.FOUNDATIONS_CONFIG = {
  supabaseUrl: "https://olncfwohfpgpmygxjpcm.supabase.co",
  supabaseAnonKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9sbmNmd29oZnBncG15Z3hqcGNtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTE3MzQ0ODgsImV4cCI6MjEwNzMxMDQ4OH0.rcjQ4E2oPVyth1bboHvwRFqUtwAAAkmUw1TGwF20_Uc",
  memberKey: "cs_foundations_member_v1",
  progressKey: "cs_foundations_progress_v1"
};
