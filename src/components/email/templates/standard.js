import mjml2html from 'mjml-browser';

const getCtaButton = (actionButtonLink, actionButtonText) => `<mj-button background-color="#ff2709" href="${actionButtonLink}">${actionButtonText}</mj-button>`;

export default function createTemplate(bodyText, callToActionText, callToActionLink) {
  const actionButton = (callToActionLink && callToActionText) ? getCtaButton(callToActionLink, callToActionText) : '';
  return mjml2html(`<mjml>
  <mj-body>
    <mj-section>
      <mj-column width="100%">
        <mj-image width="200px" src="https://res.cloudinary.com/db8zpy2k5/image/upload/v1623567889/logo_iunb8b.png"></mj-image>

      </mj-column>
    </mj-section>
    <mj-raw>
      <!-- Intro text -->
    </mj-raw>
    <mj-section background-color="#fafafa">
      <mj-column width="100%">
        <mj-text color="#525252">${bodyText}.</mj-text>
        ${actionButton}
      </mj-column>
    </mj-section>
    <mj-section background-color="#fafafa">
      <mj-column>
        <mj-social border-radius="0" icon-size="30%" mode="horizontal" line-height="0">
          <mj-social-element src="https://res.cloudinary.com/db8zpy2k5/image/upload/v1624161418/slack_tfrfbj.svg" target="_blank" name="slack" href="https://makeuwa.slack.com" alt="Slack">
          </mj-social-element>
          <mj-social-element target="_blank" src="https://res.cloudinary.com/db8zpy2k5/image/upload/v1623570761/facebook_uj5yez.svg" href="https://www.facebook.com/uwamakers/" alt="Facebook">

          </mj-social-element>
          <mj-social-element target="_blank" src="https://res.cloudinary.com/db8zpy2k5/image/upload/v1624161323/instagram_ktbjqh.svg" href="https://www.instagram.com/uwa_makers/?hl=en" alt="Instagram">

          </mj-social-element>
        </mj-social>
      </mj-column>
    </mj-section>
  </mj-body>
</mjml>`).html;
}
