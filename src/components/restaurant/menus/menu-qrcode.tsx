"use client";
import { IconButton, Button, Tooltip, Stack } from "@mui/material";
import QrCodeIcon from '@mui/icons-material/QrCode';
import ShareIcon from '@mui/icons-material/Share';
import RefreshIcon from '@mui/icons-material/Refresh';
import { useMutation } from "@tanstack/react-query";
import { generateMenuQRCode } from "@/actions/actions.menu";
import { useToast } from "@/context/toastContext";
import Image from "next/image";
import { useParams } from "next/navigation";

interface MenuQRCodeProps {
  menuId: string;
  qrCode?: {
    url: string;
    createdAt: Date;
  };
}

export default function MenuQRCode({ menuId, qrCode }: MenuQRCodeProps) {
  const { showToast } = useToast();
  const {restaurantId} = useParams(); 
  const qrCodeMutation = useMutation({
    mutationFn: async () => generateMenuQRCode(menuId, restaurantId as string || null),
    onSuccess: (response) => {
      if (response.success) {
        showToast("QR code generated successfully", "success");
      } else {
        showToast(response.error || "Failed to generate QR code", "error");
      }
    },
    onError: () => {
      showToast("Error generating QR code", "error");
    }
  });

  const handleShare = async () => {
    if (!qrCode?.url) return;

    try {
      const blob = await fetch(qrCode.url).then(r => r.blob());
      const file = new File([blob], 'menu-qr.png', { type: 'image/png' });

      if (navigator.share) {
        await navigator.share({
          title: 'Menu QR Code',
          files: [file]
        });
      } else {
        await navigator.clipboard.writeText(qrCode.url);
        showToast("QR code URL copied to clipboard", "success");
      }
    } catch (err) {
      showToast((err as Error).message || "Error sharing QR code", "error");
    }
  };

  return (
    <Stack
      direction="row"
      spacing={1}
      alignItems="center"
      sx={{
        ml: { xs: 0, sm: 'auto' },
        width: { sm: 'auto' }
      }}
    >
      {qrCode?.url ? (
        <>
          <Image
            src={qrCode.url}
            alt="Menu QR Code"
            width={75}
            height={75}
            className="rounded-md"
            unoptimized
          />
          <Tooltip title="Share QR Code">
            <IconButton onClick={handleShare} size="small">
              <ShareIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Regenerate QR Code">
            <IconButton
              onClick={() => qrCodeMutation.mutate()}
              size="small"
              disabled={qrCodeMutation.isPending}
            >
              <RefreshIcon />
            </IconButton>
          </Tooltip>
        </>
      ) : (
        <Button
          startIcon={<QrCodeIcon />}
          variant="outlined"
          size="small"
          onClick={() => qrCodeMutation.mutate()}
          disabled={qrCodeMutation.isPending}
        >
          {qrCodeMutation.isPending ? 'Generating...' : 'Generate QR'}
        </Button>
      )}
    </Stack>
  );
}