import { useMutation } from '@tanstack/react-query';
import { useRef } from 'react';
import { useForm, type DefaultValues, type FieldValues, type Resolver } from 'react-hook-form';
import { Keyboard } from 'react-native';

export function useAuthForm<T extends FieldValues>(
  resolver: Resolver<T>,
  defaultValues: DefaultValues<T>,
  action: (values: T) => Promise<unknown>,
) {
  const submitting = useRef(false);
  const form = useForm<T>({
    resolver,
    defaultValues,
    mode: 'onTouched',
    reValidateMode: 'onChange',
  });

  const mutation = useMutation({ mutationFn: action, networkMode: 'always', retry: 0 });
  const onSubmit = async (values: T) => {
    if (submitting.current) return;
    submitting.current = true;
    Keyboard.dismiss();
    try {
      await mutation.mutateAsync(values);
    } catch {
    } finally {
      submitting.current = false;
    }
  };
  const submit = () => form.handleSubmit(onSubmit)();
  return {
    form,
    submit,
    pending: form.formState.isSubmitting || mutation.isPending,
  };
}
