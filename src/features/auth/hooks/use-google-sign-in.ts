import { useMutation } from '@tanstack/react-query';
import { useAuthFlow } from '../auth-flow.context';

export function useGoogleSignIn() {
  const { signInWithGoogle } = useAuthFlow();
  const mutation = useMutation({
    mutationFn: signInWithGoogle,
    networkMode: 'always',
    retry: 0,
  });
  return {
    submit: () => mutation.mutate(),
    pending: mutation.isPending,
    error: mutation.error,
    clearError: mutation.reset,
  };
}
