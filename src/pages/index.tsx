import {
  TextInput,
  Text,
  Container,
  AppShell,
  Title,
  Group,
  MantineProvider,
  GlobalStyles,
  NormalizeCSS,
  Button,
} from "@mantine/core";
import { graphql } from "gatsby";
import * as React from "react";
import add from "date-fns/add";
import format from "date-fns/format";
import { useForm } from "@mantine/hooks";
import formatDistance from "date-fns/formatDistance";
import differenceInDays from "date-fns/differenceInDays";
import Helmet from "react-helmet";

type UpcomingWord = { type: "notValid" } | { type: "valid"; date: Date };

const baseDate = new Date(2021, 5, 19, 0, 0, 0, 0);

// markup
const IndexPage = (props: { data: { wordle: { words: string[] } } }) => {
  const form = useForm({
    initialValues: {
      word: "",
    },

    validationRules: {
      word: (value: string) => value.length === 5,
    },
  });
  const [word, setWord] = React.useState<UpcomingWord | undefined>();
  const [answer, setAnswer] = React.useState<string | undefined>();

  function search(word: string) {
    const transformedWord = word.toLowerCase();
    const index = props.data.wordle.words.indexOf(transformedWord);
    if (index === -1) {
      setWord({ type: "notValid" });
      return;
    }
    // const t = new Date().setHours()
    const nextDate = add(baseDate, { days: index });
    nextDate.setHours(0, 0, 0, 0);
    setWord({ type: "valid", date: nextDate });
  }

  function revealAnswer() {
    if (answer) {
      setAnswer(undefined);
      return;
    }
    const days = differenceInDays(new Date(), baseDate);
    const newAnswer = props.data.wordle.words[days];
    setAnswer(newAnswer);
  }

  return (
    <MantineProvider
      theme={{
        colorScheme: "dark",
        // fontFamily:
        //   "Poppins,Inter,-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica,Arial,sans-serif,Apple Color Emoji,Segoe UI Emoji",
      }}
    >
      <GlobalStyles />
      <NormalizeCSS />
      <Helmet>
        <title>Wordle Search</title>
        <meta
          name="description"
          content="Find today's correct word and figure out when your word will be the answer."
        />
      </Helmet>
      <AppShell>
        <Container>
          <Group direction="column" spacing={16}>
            <Title>Wordle Search</Title>
            <Text size="xl" style={{ lineHeight: "1.7" }}>
              Wordle has a public list of all possible answers, each day's
              correct answer goes in order according to that list. It's possible
              to predict the correct answer for each day and ruin the fun for
              absolutely no reason whatsoever.
            </Text>
            <Text color="dimmed">
              Please don't use this to spoil the fun for others.
            </Text>
            <Container
              style={{
                width: "100%",
                height: "1px",
                background: "rgba(255, 255, 255, 0.04)",
              }}
            />
            <Button color="gray" onClick={revealAnswer}>
              {answer ? "Hide" : "Reveal"} Today's Answer
            </Button>
            {answer && (
              <Text>
                Today's answer is <b>{answer}</b>
              </Text>
            )}
            <form onSubmit={form.onSubmit((values) => search(values.word))}>
              <TextInput
                style={{ width: "100%" }}
                label="When will my word be the correct answer?"
                placeholder="crane"
                size="lg"
                {...form.getInputProps("word")}
              />
            </form>
            {word &&
              (word.type === "notValid" ? (
                <Group spacing={4} direction="column">
                  <Text>
                    Sorry, that word will <b>never</b> be a correct answer.
                  </Text>
                  <Title>Huh? But the game doesn't say it's invalid??</Title>
                  <Text style={{ lineHeight: "1.7" }} size="lg">
                    Wordle keeps 2 separate list of valid words. One with the
                    ones that will eventually be the answer, and another with
                    valid guesses that will never actually be the answer.
                  </Text>
                </Group>
              ) : (
                <Group
                  direction="column"
                  spacing={4}
                  style={{ fontSize: "16px" }}
                  sx={{ fontSize: "16px" }}
                >
                  <Text inherit>
                    Your word will be the correct answer on{" "}
                    <b>{format(word.date, "LLLL dd, yyyy")}</b>
                  </Text>
                  <Text inherit>
                    That's in <b>{formatDistance(word.date, new Date())}</b>!
                  </Text>
                </Group>
              ))}
          </Group>
        </Container>
      </AppShell>
    </MantineProvider>
  );
};

export const query = graphql`
  query WordsQuery {
    wordle: wordleWords {
      words
    }
  }
`;

export default IndexPage;
