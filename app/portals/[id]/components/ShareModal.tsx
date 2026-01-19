import React, { useState } from 'react';
import { Modal } from '@/components/ui';
import { 
  WhatsappShareButton, 
  EmailShareButton,
} from 'react-share';
import { 
  MessageCircle, 
  Mail, 
  Copy, 
  Share2 
} from 'lucide-react';
import styles from './ShareModal.module.css';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  shareUrl: string;
  projectName: string;
}

export const ShareModal: React.FC<ShareModalProps> = ({ 
  isOpen, 
  onClose, 
  shareUrl, 
  projectName 
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Project Portal: ${projectName}`,
          text: `Check out the updates for our project: ${projectName}`,
          url: shareUrl,
        });
      } catch (err) {
        console.error('Error sharing:', err);
      }
    }
  };

  const canNativeShare = typeof navigator !== 'undefined' && !!navigator.share;

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title="Share Project Portal"
    >
      <div className={styles.shareGrid}>
        <WhatsappShareButton 
          url={shareUrl} 
          title={`Project Portal: ${projectName}\nCheck out the updates here:`}
          className={styles.shareOption}
        >
          <div className={`${styles.iconWrapper} ${styles.whatsappIcon}`}>
            <MessageCircle size={24} />
          </div>
          <span className={styles.optionLabel}>WhatsApp</span>
        </WhatsappShareButton>

        <EmailShareButton 
          url={shareUrl} 
          subject={`Project Portal: ${projectName}`}
          body={`Hi, here is the link to follow the progress of our project: ${projectName}\n\n`}
          className={styles.shareOption}
        >
          <div className={`${styles.iconWrapper} ${styles.emailIcon}`}>
            <Mail size={24} />
          </div>
          <span className={styles.optionLabel}>Email</span>
        </EmailShareButton>

        <div className={styles.shareOption} onClick={handleCopyLink}>
          <div className={`${styles.iconWrapper} ${styles.copyIcon}`}>
            <Copy size={24} />
          </div>
          <span className={styles.optionLabel}>Copy Link</span>
        </div>

        {canNativeShare && (
          <div className={styles.shareOption} onClick={handleNativeShare}>
            <div className={`${styles.iconWrapper} ${styles.nativeIcon}`}>
              <Share2 size={24} />
            </div>
            <span className={styles.optionLabel}>More Options</span>
          </div>
        )}
      </div>

      <div className={styles.linkPreview}>
        {shareUrl}
        {copied && <div className={styles.copyStatus}>Copied!</div>}
      </div>
    </Modal>
  );
};
