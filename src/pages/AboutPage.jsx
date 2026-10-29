import Icon from "../components/Icon.jsx";
import SectionHeading from "../components/SectionHeading.jsx";
import SmartImage from "../components/SmartImage.jsx";
import { EnquiryCTA, ProcessSteps } from "../components/home/HomeSections.jsx";
import { useDocumentMeta } from "../hooks/useDocumentMeta.js";

const VALUES = [
  {
    icon: "heart",
    title: "Thoughtful by design",
    text: "We choose products people genuinely use and keep, not throwaway giveaways.",
  },
  {
    icon: "leaf",
    title: "Responsible choices",
    text: "Recycled packaging, organic fabrics and long-lasting materials wherever possible.",
  },
  {
    icon: "award",
    title: "Quality you can see",
    text: "Every order is sampled, checked and finished with care before it reaches your people.",
  },
];

export default function AboutPage() {
  useDocumentMeta({
    title: "About Us",
    description:
      "Tribe Green is a corporate gifting brand focused on thoughtful, personalised and responsibly made gifts for teams and clients.",
    path: "/about",
  });
  return (
    <>
      <section className="page-hero">
        <div className="container">
          <SectionHeading
            as="h1"
            align="left"
            eyebrow="About Tribe Green"
            title="Gifting that feels personal at any scale"
            text="We help companies say thank you in a way that is remembered."
          />
        </div>
      </section>

      <section className="section section--tight">
        <div className="container about-grid">
          <div className="about-grid__media">
            <SmartImage
              src="/images/products/signature-wellness-hamper.svg"
              alt="Signature wellness hamper in a handwoven basket"
              width={800}
              height={800}
            />
          </div>
          <div className="prose">
            <h2>Our story</h2>
            <p>
              Tribe Green was created around a simple idea: corporate gifts
              should feel as considered as gifts between friends. We bring
              together carefully chosen merchandise, natural materials and
              professional branding so that every box you send reflects the care
              your company has for its people.
            </p>
            <p>
              Whether you are welcoming fifty new joiners or thanking a handful
              of key clients, our team guides you from first idea to final
              delivery: shortlisting products, preparing artwork, approving
              mock-ups and coordinating dispatch.
            </p>
            <p className="muted">
              Tribe Green is a sample brand created for the V Green Media App
              and Web Developer assignment. Product imagery is illustrative.
            </p>
          </div>
        </div>
      </section>

      <section
        className="section section--beige"
        aria-labelledby="values-title"
      >
        <div className="container">
          <SectionHeading
            id="values-title"
            eyebrow="What we stand for"
            title="Our principles"
          />
          <ul className="service-grid service-grid--three">
            {VALUES.map((v) => (
              <li className="service-card" key={v.title}>
                <span className="service-card__icon">
                  <Icon name={v.icon} size={26} />
                </span>
                <h3>{v.title}</h3>
                <p>{v.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <ProcessSteps />
      <EnquiryCTA />
    </>
  );
}
