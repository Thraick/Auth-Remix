interface FaqType {
    question: string;
    answer: string;
    jid: string;
}

interface IntentUtteranceType {
    jid: string;
    utterance: string;
}
interface IntentType {
    jid: string;
    intent: string;
}

interface StateType {
    intent: string;
    response: string;
    jid: string;
}


interface EntityType {
    jid: string;
    entity: string;
}

interface EntityContextType {
    jid: string;
    entity_value: string;
    utterance: string;
}
