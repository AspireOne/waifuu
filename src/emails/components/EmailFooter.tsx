import { Container, Link, Row, Section, Text } from "@jsx-email/all";
import { t } from "@lingui/macro";

// Create a footer component that can be used in all emails.
// It must include at least unsubscribe link, info, logo
// Only the imported components from @jsx-email/all and tailwindcss can be used.
export const EmailFooter = () => {
  return (
    <Section className=" text-sm">
      <Container>
        {/*<Row>
          <Column className="mb-4">
            <Img
              src="https://user-images.githubusercontent.com/57546404/275817598-fd2c2c4b-108a-4ea3-a451-614d79afd405.jpg"
              alt="Company Logo"
              className="h-8 w-auto"
            />
          </Column>
        </Row>*/}
        <Row className={"flex flex-col gap-3"}>
          <Text className={"text-center"}>
            {t`If you no longer wish to receive these emails, you can unsubscribe`}{" "}
            <Link href="https://example.com" className="text-blue-600 underline">
              {t`here.`}
            </Link>
          </Text>
          <Text className={"text-center"}>
            &copy; {new Date().getFullYear()} Waifuu. All rights reserved.
          </Text>
        </Row>
      </Container>
    </Section>
  );
};
