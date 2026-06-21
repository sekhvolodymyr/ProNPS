import { updateSettingsAction } from "@/app/actions";
import { ActionForm } from "@/components/forms";
import { requireOwnerCompany } from "@/lib/auth";

export default async function SettingsPage() {
  const { company } = await requireOwnerCompany();
  const settings = company.thankYouSettings;

  return (
    <>
      <div className="main-header">
        <div>
          <h1>Налаштування</h1>
          <p className="muted">Подячна сторінка, бонус і сповіщення про негативні оцінки.</p>
        </div>
      </div>
      <section className="panel" style={{ padding: 22, maxWidth: 760 }}>
        <ActionForm action={updateSettingsAction}>
          <label className="field">Заголовок подяки<input defaultValue={settings?.title} name="title" required /></label>
          <label className="field">Повідомлення<textarea defaultValue={settings?.message} name="message" required /></label>
          <label className="field"><span><input defaultChecked={settings?.bonusEnabled} name="bonusEnabled" type="checkbox" /> Показувати бонус</span></label>
          <label className="field">Опис бонусу<textarea defaultValue={settings?.bonusText ?? ""} name="bonusText" /></label>
          <label className="field">Промокод або інструкція<input defaultValue={settings?.promoCode ?? ""} name="promoCode" /></label>
          <label className="field">Текст кнопки<input defaultValue={settings?.buttonLabel ?? ""} name="buttonLabel" /></label>
          <label className="field">URL кнопки<input defaultValue={settings?.buttonUrl ?? ""} name="buttonUrl" /></label>
          <label className="field"><span><input defaultChecked={company.negativeAlertEnabled} name="negativeAlertEnabled" type="checkbox" /> Email-сповіщення про 1-3</span></label>
        </ActionForm>
      </section>
    </>
  );
}
