/* eslint-disable @typescript-eslint/no-explicit-any */
import Autoplay from 'embla-carousel-autoplay';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Link from '@mui/material/Link';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { Carousel, CarouselDotButtons, useCarousel } from '@/components/carousel';
import { Image } from '@/components/image';
import { varAlpha } from '@/theme/styles';


// ----------------------------------------------------------------------

export function EcommerceNewProducts({ list, sx, ...other }: any) {
  const carousel = useCarousel({ loop: true }, [Autoplay({ playOnInit: true, delay: 8000 })]);

  return (
    <Card sx={{ bgcolor: 'common.black', ...sx }} {...other}>
      <CarouselDotButtons
        scrollSnaps={carousel.dots.scrollSnaps}
        selectedIndex={carousel.dots.selectedIndex}
        onClickDot={carousel.dots.onClickDot}
        sx={{
          right: 20,
          bottom: 20,
          position: 'absolute',
          color: 'primary.light',
        }}
      />

      <Carousel carousel={carousel}>
        {list.map((item: any) => (
          <CarouselItem key={item.id} item={item} />
        ))}
      </Carousel>
    </Card>
  );
}

// ----------------------------------------------------------------------

function CarouselItem({ item, ...other }: any) {
  return (
    <Box sx={{ width: 1, position: 'relative', ...other }}>
      <Box
        sx={{
          p: 3,
          left: 0,
          width: 1,
          bottom: 0,
          zIndex: 9,
          display: 'flex',
          position: 'absolute',
          color: 'common.white',
          flexDirection: 'column',
        }}
      >
        <Typography variant="overline" sx={{ opacity: 0.48 }}>
          New
        </Typography>

        <Link color="inherit" underline="none" variant="h5" noWrap sx={{ mt: 1, mb: 3 }}>
          {item.name}
        </Link>

        <Button color="primary" variant="contained" sx={{ alignSelf: 'flex-start' }}>
          Buy now
        </Button>
      </Box>

      <Image
        alt={item.name}
        src={item.coverUrl}
        slotProps={{
          overlay: {
            backgroundImage: (theme: any) =>
              `linear-gradient(to bottom, ${varAlpha(
                theme.vars.palette.common.blackChannel,
                0
              )} 0%, ${theme.vars.palette.common.black} 75%)`,
          },
        }}
        sx={{
          width: 1,
          height: { xs: 288, xl: 320 },
        }}
      />
    </Box>
  );
}
