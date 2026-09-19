import { Section } from '@/components/Section';
import { Field } from '@/components/controls/Field';
import { Segmented } from '@/components/controls/Segmented';
import { Toggle } from '@/components/controls/Toggle';
import { CONTENT_TYPES, type Content, type ContentType } from '@/lib/content';
import { useI18n } from '@/lib/i18n';
import IconLink from '~icons/solar/link-round-angle-bold';
import IconText from '~icons/solar/text-square-bold';
import IconWifi from '~icons/solar/wi-fi-bold';
import IconCard from '~icons/solar/user-id-bold';
import IconMail from '~icons/solar/letter-bold';
import IconSms from '~icons/solar/chat-round-dots-bold';
import IconPhone from '~icons/solar/phone-rounded-bold';
import IconPen from '~icons/solar/pen-new-square-bold';

const ICONS: Record<ContentType, React.ComponentType> = {
  url: IconLink,
  text: IconText,
  wifi: IconWifi,
  vcard: IconCard,
  email: IconMail,
  sms: IconSms,
  phone: IconPhone,
};

interface Props {
  content: Content;
  onChange: (c: Content) => void;
}

export function ContentPanel({ content, onChange }: Props) {
  const { t } = useI18n();
  const set = <K extends keyof Content>(key: K, value: Content[K]) => onChange({ ...content, [key]: value });
  const sub = <K extends 'wifi' | 'vcard' | 'email' | 'sms' | 'phone'>(key: K, p: Partial<Content[K]>) =>
    set(key, { ...content[key], ...p });

  return (
    <Section index="1" title={t('section.content')} icon={<IconPen />}>
      <Segmented<ContentType>
        value={content.type}
        onChange={(type) => set('type', type)}
        options={CONTENT_TYPES.map((type) => {
          const Icon = ICONS[type];
          return { value: type, label: (<><Icon />{t(`type.${type}`)}</>) };
        })}
      />

      {content.type === 'url' && (
        <Field
          label={t('field.url')}
          type="url"
          inputMode="url"
          autoComplete="off"
          placeholder={t('field.url.placeholder')}
          value={content.url}
          onChange={(e) => set('url', e.target.value)}
        />
      )}

      {content.type === 'text' && (
        <Field
          as="textarea"
          label={t('field.text')}
          placeholder={t('field.text.placeholder')}
          value={content.text}
          onChange={(e) => set('text', e.target.value)}
        />
      )}

      {content.type === 'wifi' && (
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label={t('field.ssid')} value={content.wifi.ssid} onChange={(e) => sub('wifi', { ssid: e.target.value })} />
          <Field
            label={t('field.password')}
            type="text"
            autoComplete="off"
            disabled={content.wifi.encryption === 'nopass'}
            value={content.wifi.password}
            onChange={(e) => sub('wifi', { password: e.target.value })}
          />
          <Segmented<'WPA' | 'WEP' | 'nopass'>
            label={t('field.encryption')}
            value={content.wifi.encryption}
            onChange={(encryption) => sub('wifi', { encryption })}
            options={[
              { value: 'WPA', label: 'WPA/WPA2' },
              { value: 'WEP', label: 'WEP' },
              { value: 'nopass', label: t('field.encryption.nopass') },
            ]}
          />
          <Toggle
            className="sm:mt-6"
            label={t('field.hidden')}
            checked={content.wifi.hidden}
            onChange={(hidden) => sub('wifi', { hidden })}
          />
        </div>
      )}

      {content.type === 'vcard' && (
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label={t('field.firstName')} value={content.vcard.firstName} onChange={(e) => sub('vcard', { firstName: e.target.value })} />
          <Field label={t('field.lastName')} value={content.vcard.lastName} onChange={(e) => sub('vcard', { lastName: e.target.value })} />
          <Field label={t('field.org')} value={content.vcard.org} onChange={(e) => sub('vcard', { org: e.target.value })} />
          <Field label={t('field.title')} value={content.vcard.title} onChange={(e) => sub('vcard', { title: e.target.value })} />
          <Field label={t('field.phone')} type="tel" value={content.vcard.phone} onChange={(e) => sub('vcard', { phone: e.target.value })} />
          <Field label={t('field.email')} type="email" value={content.vcard.email} onChange={(e) => sub('vcard', { email: e.target.value })} />
          <Field className="sm:col-span-2" label={t('field.website')} type="url" value={content.vcard.url} onChange={(e) => sub('vcard', { url: e.target.value })} />
        </div>
      )}

      {content.type === 'email' && (
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label={t('field.to')} type="email" value={content.email.to} onChange={(e) => sub('email', { to: e.target.value })} />
          <Field label={t('field.subject')} value={content.email.subject} onChange={(e) => sub('email', { subject: e.target.value })} />
          <Field className="sm:col-span-2" as="textarea" label={t('field.body')} value={content.email.body} onChange={(e) => sub('email', { body: e.target.value })} />
        </div>
      )}

      {content.type === 'sms' && (
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label={t('field.phone')} type="tel" value={content.sms.phone} onChange={(e) => sub('sms', { phone: e.target.value })} />
          <Field className="sm:col-span-2" as="textarea" label={t('field.message')} value={content.sms.message} onChange={(e) => sub('sms', { message: e.target.value })} />
        </div>
      )}

      {content.type === 'phone' && (
        <Field label={t('field.number')} type="tel" placeholder="+34 600 000 000" value={content.phone.number} onChange={(e) => sub('phone', { number: e.target.value })} />
      )}
    </Section>
  );
}
