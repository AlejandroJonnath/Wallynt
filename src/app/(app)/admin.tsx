// Esta pantalla ya no se utiliza. El panel de administración
// está distribuido en: admin-kpis, admin-insights, admin-export, admin-users
import { Redirect } from 'expo-router';
export default function AdminRedirect() {
  return <Redirect href="/(app)/admin-kpis" />;
}
