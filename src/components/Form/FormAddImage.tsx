import { Box, Button, Stack, useToast } from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';

import { api } from '../../services/api';
import { FileInput } from '../Input/FileInput';
import { TextInput } from '../Input/TextInput';

interface FormAddImageProps {
  closeModal: () => void;
}
const TEN_MEGABYTES = 10485760000;

export function FormAddImage({ closeModal }: FormAddImageProps): JSX.Element {
  const [imageUrl, setImageUrl] = useState('');
  const [localImageUrl, setLocalImageUrl] = useState('');
  const toast = useToast();

  const formValidations = {
    image: {
      required: "Arquivo obrigatório",
      validate: {
        lessThan10MB: (file: File) => file[0].size < TEN_MEGABYTES || 'O arquivo deve ser menor que 10MB',
        acceptedFormats: (file: File) => {
          const acceptedFormats = ['image/jpeg', 'image/png', 'image/gif']

          return acceptedFormats.includes(file[0].type) || 'Somente são aceitos arquivos PNG, JPEG e GIF'
        },
      }

    },
    title: {
      required: 'Título obrigatório',
      minLength: 2,
      maxLength: 20

    },
    description: {
      required: 'Descrição obrigatória',
      maxLength: 65

    },
  };
  async function addImage(data: any): Promise<void> {
    await api.post('api/images', data)
  }
  const queryClient = useQueryClient();
  const mutation = useMutation(
    addImage,
    {
      onSuccess: () => {
        queryClient.invalidateQueries('images')
      }
    }
  );

  const {
    register,
    handleSubmit,
    reset,
    formState,
    setError,
    trigger,
  } = useForm();
  const { errors } = formState;

  const onSubmit = async (data: Record<string, unknown>): Promise<void> => {
    try {
      if (!imageUrl) {
        toast({
          title: "Imagem nao encontrada.",
          status: "error",
          duration: 4000,
          isClosable: true,
        })
      }
      const newImage = {
        title: data.title,
        description: data.description,
        url: imageUrl
      }
      await mutation.mutateAsync(newImage)

      toast({
        title: "Imagem cadastrada",
        description: "Sua imagem foi cadastrada com sucesso.",
        status: "success",
        duration: 4000,
        isClosable: true,
      })

    } catch {
      toast({
        title: "Erro ao subir a foto :(",
        status: "error",
        duration: 4000,
        isClosable: true,
      })
    } finally {
      reset()
      setImageUrl('')
      setLocalImageUrl('')
      closeModal()
    }
  };

  return (
    <Box as="form" width="100%" onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={4}>
        <FileInput
          setImageUrl={setImageUrl}
          localImageUrl={localImageUrl}
          setLocalImageUrl={setLocalImageUrl}
          setError={setError}
          trigger={trigger}
          {...register("image", formValidations.image)}
          error={errors.image}
        />

        <TextInput
          placeholder="Título da imagem..."
          {...register("title", formValidations.title)}
          error={errors.title}
        />

        <TextInput
          placeholder="Descrição da imagem..."
          {...register("description", formValidations.description)}
          error={errors.description}
        />
      </Stack>

      <Button
        my={6}
        isLoading={formState.isSubmitting}
        isDisabled={formState.isSubmitting}
        type="submit"
        w="100%"
        py={6}
      >
        Enviar
      </Button>
    </Box>
  );
}
