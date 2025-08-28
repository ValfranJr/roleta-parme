import { requireAdminAuth } from '@/lib/auth';
import { client } from '@/lib/db';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { LogoutButton } from '@/components/admin/logout-button';

interface CouponUser {
  id: number;
  name: string;
  whatsapp: string;
  coupon_won: string | null;
  created_at: string;
}

export default async function AdminDashboardPage() {
  requireAdminAuth(); // Protect this page

  let users: CouponUser[] = [];
  let error: string | null = null;

  try {
    const result = await client.query('SELECT id, name, whatsapp, coupon_won, created_at FROM coupon_users ORDER BY created_at DESC');
    users = result.rows;
  } catch (err) {
    console.error('Error fetching coupon users for dashboard:', err);
    error = 'Falha ao carregar os dados dos usuários.';
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Painel do Administrador</h1>
        <LogoutButton />
      </div>

      <Card className="w-full">
        <CardHeader>
          <CardTitle>Usuários da Roleta</CardTitle>
          <CardDescription>Lista de todos os usuários que preencheram o formulário.</CardDescription>
        </CardHeader>
        <CardContent>
          {error ? (
            <p className="text-red-500 text-center">{error}</p>
          ) : users.length === 0 ? (
            <p className="text-center text-muted-foreground">Nenhum usuário registrado ainda.</p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Nome</TableHead>
                    <TableHead>WhatsApp</TableHead>
                    <TableHead>Cupom Ganho</TableHead>
                    <TableHead>Data de Registro</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>{user.id}</TableCell>
                      <TableCell>{user.name}</TableCell>
                      <TableCell>{user.whatsapp}</TableCell>
                      <TableCell>{user.coupon_won || 'Não girou'}</TableCell>
                      <TableCell>{format(new Date(user.created_at), 'dd/MM/yyyy HH:mm', { locale: ptBR })}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}