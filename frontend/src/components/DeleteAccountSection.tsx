import { useState } from 'react';
import { Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '../contexts/AuthContext';
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from './ui/alert-dialog';

interface DeleteAccountSectionProps {
  onDeleted?: () => void;
}

const PALAVRA_CONFIRMACAO = 'EXCLUIR';

export default function DeleteAccountSection({ onDeleted }: DeleteAccountSectionProps) {
  const { deleteAccount } = useAuth();
  const [open, setOpen] = useState(false);
  const [senha, setSenha] = useState('');
  const [confirmacao, setConfirmacao] = useState('');
  const [excluindo, setExcluindo] = useState(false);

  const podeConfirmar = confirmacao.trim() === PALAVRA_CONFIRMACAO && !excluindo;

  const fechar = (aberto: boolean) => {
    if (excluindo) return; // não fecha no meio da requisição
    setOpen(aberto);
    if (!aberto) { setSenha(''); setConfirmacao(''); }
  };

  const confirmarExclusao = async () => {
    if (!podeConfirmar) return;
    setExcluindo(true);
    try {
      await deleteAccount(senha, confirmacao.trim());
      toast.success('Sua conta foi excluída.');
      setOpen(false);
      onDeleted?.();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Não foi possível excluir a conta.');
    } finally {
      setExcluindo(false);
    }
  };

  return (
    <section className="mt-4 rounded-[14px] border border-red-200 bg-white p-4">
      <h2 className="text-[13px] font-semibold text-[#9b3d34]">Zona de perigo</h2>
      <p className="mt-1 text-[11px] leading-4 text-[#718075]">
        Excluir a conta remove seus dados pessoais e seu acesso às hortas. Tarefas em andamento voltam a ficar disponíveis
        para outros participantes. Esta ação não pode ser desfeita.
      </p>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="mt-3 inline-flex items-center gap-2 rounded-lg border border-red-200 px-3 py-2 text-[12px] font-semibold text-red-700 hover:bg-red-50"
      >
        <Trash2 className="size-4" /> Excluir minha conta
      </button>

      <AlertDialog open={open} onOpenChange={fechar}>
        <AlertDialogContent className="max-w-[90%] sm:max-w-md rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir conta definitivamente?</AlertDialogTitle>
            <AlertDialogDescription>
              Seu nome, e-mail, telefone e localização serão apagados. O histórico de tarefas concluídas fica nas hortas
              de forma anônima.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <label className="block text-[12px] font-medium text-[#4a5565]">
            Senha atual
            <input
              type="password"
              autoComplete="current-password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              className="mt-1.5 h-10 w-full rounded-lg border border-gray-200 px-3 text-[13px] outline-none focus:border-red-400"
            />
            <span className="mt-1 block text-[10px] text-[#8a958d]">Se você entra com o Google, deixe em branco.</span>
          </label>

          <label className="block text-[12px] font-medium text-[#4a5565]">
            Digite <strong>{PALAVRA_CONFIRMACAO}</strong> para confirmar
            <input
              value={confirmacao}
              onChange={(e) => setConfirmacao(e.target.value)}
              className="mt-1.5 h-10 w-full rounded-lg border border-gray-200 px-3 text-[13px] outline-none focus:border-red-400"
            />
          </label>

          <AlertDialogFooter>
            <AlertDialogCancel disabled={excluindo}>Cancelar</AlertDialogCancel>
            {/* Botão comum (e não AlertDialogAction) para o modal não fechar sozinho se der erro */}
            <button
              type="button"
              onClick={() => void confirmarExclusao()}
              disabled={!podeConfirmar}
              className="rounded-md bg-red-600 px-4 py-2 text-[13px] font-semibold text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {excluindo ? 'Excluindo…' : 'Excluir conta'}
            </button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </section>
  );
}
