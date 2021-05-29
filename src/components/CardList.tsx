import { SimpleGrid, useDisclosure } from '@chakra-ui/react';
import { useState } from 'react';
import { Card } from './Card';
import { ModalViewImage } from './Modal/ViewImage';

interface Card {
  title: string;
  description: string;
  url: string;
  ts: number;
  id: string;
}

interface CardsProps {
  cards: Card[];
}

export function CardList({ cards }: CardsProps): JSX.Element {
  const [selectedImage, setSelectedImage] = useState('')
  const { isOpen, onOpen, onClose } = useDisclosure()
  function handleViewImage(url: string): void {
    setSelectedImage(url)
    onOpen()
  }
  return (
    <>
      <SimpleGrid gap={40} gridTemplateColumns="1fr 1fr 1fr">
        {cards.map(card => (
          <Card viewImage={handleViewImage} data={card} key={String(card.id)} />
        ))}
      </SimpleGrid>

      <ModalViewImage imgUrl={selectedImage} isOpen={isOpen} onClose={onClose} />
    </>
  );
}
