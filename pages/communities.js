import Image from "next/image";
import Head from "next/head";
import css from "styles/communities.module.scss";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function Communities({ images, texts }) {
  const islands = texts.map((text) => {
    const [title, description, linkHref, linkText, linkCss] = text;
    return <div key={title} className={css.floatingIsland} role="group">
      <h2>{title}</h2>
      <p>{description}
        <span>
          <a href={linkHref} target="_blank" rel="noreferrer">
            <i className={linkCss}></i>{linkText}
          </a>
        </span>
      </p>
    </div>;
  });

  const communityImages = images.map((image) => {
    return <Image
      alt="Challenge Community image"
      key={image}
      src={image}
      height={240}
      width={240}
      loading="lazy" />;
  });

  return <div className={css.bgArea} role="banner">
    <Head>
      <title>League of Legends Challenge Community</title>
    </Head>

    <section className="object1000">
      <div className={css.topArea}>
        <h1 className={css.heading}>Meet the <br />Challenge-Community</h1>
      </div>
    </section>

    <div className={css.scrollSection}>
      <section className="object1000" style={{ position: "relative" }}>
        {islands}
        {communityImages}
      </section>
    </div>
  </div>;
}

export async function getServerSideProps() {
  const res = await fetch("https://challenges.darkintaqt.com/communities.json");

  let images = [];
  let texts = [];
  if (res.ok) {
    const data = await res.json();
    images = data.images;
    texts = data.texts;
  }

  return {
    props: {
      images,
      texts
    }
  };
}