import {createClient} from 'https://esm.sh/@supabase/supabase-js@2.45.4';
const c=window.ATLAS_CONFIG||{};
export const configured=!!(c.url&&c.anonKey);
export const sb=configured?createClient(c.url,c.anonKey):null;
