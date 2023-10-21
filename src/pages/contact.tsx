import React from "react";
import Page from "@components/Page";
import { FiMail } from "react-icons/fi";
import { ContactUsForm } from "@components/ContactUsForm";
import Title from "@components/ui/Title";
import { Card, CardBody } from "@nextui-org/card";

export default (props: {}) => {
  return (
    <Page title={"Contact us"} unprotected={true}>
      <div className="container mx-auto max-w-5xl sm:px-10 lg:px-0 mt-24 lg:mt-20">
        <div className="flex flex-col items-center lg:items-start lg:flex-row gap-20 justify-between sm:px-4">
          <div className="">
            <Title as={"h1"} className={"title-xl"}>
              Contact us
            </Title>
            <p className="text-xl mt-8">
              Got a problem? A question? Or just want to say hi? We are here for
              you.
            </p>
            <Socials className={"mt-8"} />
          </div>

          <Card className={"w-full max-w-[400px]"}>
            {/*TODO: Logo and name*/}
            <CardBody>
              <ContactUsForm />
            </CardBody>
          </Card>
        </div>
      </div>
    </Page>
  );
};

function Socials(props: { className?: string }) {
  return (
    <div className={props.className + " text-lg"}>
      <ContactInfoItem icon={<FiMail />} href="mailto:matejpesl1@gmail.com">
        matejpesl1@gmail.com
      </ContactInfoItem>

      {/*TODO: Add socials.*/}
      {/*<ContactInfoItem icon={<FaInstagram />} href="https://www.instagram.com/vasenkecteni">
        Instagram
      </ContactInfoItem>

      <ContactInfoItem icon={<FaFacebook />} href="https://www.facebook.com/vasenkecteni">
        Facebook
      </ContactInfoItem>

      <ContactInfoItem
        icon={<FaLinkedin />}
        href="https://www.linkedin.com/in/mat%C4%9Bj-pl%C5%A1ek-64906419b/"
      >
        LinkedIn
      </ContactInfoItem>*/}
    </div>
  );
}

function ContactInfoItem(props: {
  icon: JSX.Element;
  children: string;
  href?: string;
}) {
  return (
    <div className="flex flex-row items-center gap-4">
      {props.icon}
      <a href={props.href} className={"text-[#529BAB] hover:text-blue-400"}>
        {props.children}
      </a>
    </div>
  );
}
