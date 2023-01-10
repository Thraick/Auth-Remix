interface FaqType {
    question: string;
    answer: string;
    jid: string;
}

interface IntentType {
    name_of_intent: string;
    utterances: Array<string>;
    jid: string;
}

interface StateType {
    intent: string;
    responses: Array<string>;
    jid: string;
}


interface EntityType {
    entity_type: string;
    jid: string;
}
