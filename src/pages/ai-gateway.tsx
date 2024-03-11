import { PublicPage } from "@components/PublicPage";
import { PageTitle } from "@components/PageTitle";
import { PageDescription } from "@components/PageDescription";
import Title from "@components/ui/Title";
import { Link, Spacer } from "@nextui-org/react";

export default function AiGateway() {
  return (
    <PublicPage title={"A.I. Gateway"} description={""}>
      <div
        className={"flex flex-col items-center justify-center mx-auto mb-10"}
      >
        <PageTitle className={"text-left"} center={true}>
          A.I. Gateway
        </PageTitle>
        <PageDescription className={"text-center"}>
          Ty nejdůležitější A.I. toolky současnosti
        </PageDescription>
      </div>

      <div className={"flex flex-col lg:flex-row gap-12 lg:gap-4"}>
        <div className={"w-full"}>
          <Title
            description={"V současnosti nejlepší A.I. na generování obrázků"}
          >
            DALL-E 3
          </Title>
          <p>
            <Link href={"https://designer.microsoft.com/image-creator"}>
              designer.microsoft.com/image-creator
            </Link>
          </p>
        </div>

        <div className={"w-full"}>
          <Title description={"Nejlepší A.I. v existenci"}>GPT-4</Title>
          <p>
            - Nastavení je trošku cumbersome (ale i tak jen na 2 minutky) -
            kdyby tě to zajímalo, dáme to dohromady.
          </p>
        </div>
      </div>

      <Spacer y={14} />

      <div className={"flex flex-col lg:flex-row gap-12 lg:gap-4"}>
        <div className={"w-full flex flex-col gap-14"}>
          <div className={""}>
            <Title description={"Druhé Nejlepší A.I."}>Claude</Title>
            <p className={"whitespace-pre-wrap"}>
              <Link href={"https://claude.ai"}>claude.ai</Link>
              <br />- Paměť až 300 stran A4
              <br />- Umožňuje nahrát soubory, PDFka...
              <br />- Exceluje mimo jiné i v kreativních endeavors
            </p>
          </div>
          <div>
            <Title description={"Nejlepší A.I. na převedení textu do řeči"}>
              Eleven Labs
            </Title>
            <p className={"whitespace-pre-wrap"}>
              <Link href={"https://elevenlabs.io"}>elevenlabs.io</Link>
              <br />- Výběr hlasů, neuvěřitelně realistické
              <br />- Použitelné na marketing, na informační sdělení, na funny
              videa...
              <br />- Umožňuje naklonování hlasu (stačí minuta audia)
            </p>
          </div>
        </div>

        <div className={"w-full"}>
          <Title description={"Na všechno"}>Runway</Title>
          <p className={"whitespace-pre-wrap"}>
            <Link href={"https://runwayml.com"}>runwayml.com</Link>
            <br />- Jedna z nejvýznamějších společností v oblasti A.I. vůbec,
            udělala převrat především v generování videí
            <br />- Obsahuje mrdu A.I. nástrojů na zarábání s fotkama, videama,
            i zvukem
            <br />
            <br />
            <b>Obrázky/Fotky:</b>
            <br />- Text to image (stejně jako Dall-E)
            <br />- image-to-image (úprava existující fotky jen na základě
            promptu)
            <br />- rozšíření fotky / obrázku
            <br />- generování variant, vytvoření animace z fotky, změna
            pozadí...
            <br />
            <br />
            <b>Videa:</b>
            <br />- video-to-video
            <br />- generování na základě promptu
            <br />- převedení do slow motion
            <br />- přidání titulků
            <br />- převedení do textu
            <br />- ...
          </p>
        </div>
      </div>
    </PublicPage>
  );
}
