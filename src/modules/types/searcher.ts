export interface SearcherXML {
    version: string;
    response: SearcherXMLResponse;
}
export interface SearcherXMLResponse {
    date: string;
    found: SearcherXMLFound;
    results: SearcherXMLResults;
    error?: any;
}
export interface SearcherXMLFound {
    priority: string;
    value: number;
}
export interface SearcherXMLResults {
    grouping: SearcherXMLGrouping;
}
export interface SearcherXMLGrouping {
    page: SearcherXMLPage;
    group: SearcherXMLGroup[];
}
export interface SearcherXMLPage {
    first: number;
    last: number;
}
export interface SearcherXMLGroup {
    id: number;
    doccount: number;
    doc: SearcherXMLDoc;
}
export interface SearcherXMLDoc {
    url: string;
    imgurl: string;
    title: string;
    displaylink: string;
    originalwidth: number;
    originalheight: number;
    passages: SearcherXMLPassages;
}
export interface SearcherXMLPassages {
    passage: SearcherXMLPassage[];
}
export interface SearcherXMLPassage {}

export type SearcherGetConfigType = 'png' | 'jpg' | 'gif';
export type SearcherGetConfigOrient = 'horizontal' | 'vertical' | 'square';
export type SearcherGetConfigSize = 'enormous' | 'large' | 'medium' | 'small' | 'tiny' | 'wallpaper';
export type SearcherGetConfigColor = 'gray' | 'color' | 'red' | 'orange' | 'yellow' | 'green' | 'cyan' | 'blue' | 'violet' | 'white' | 'black';
export type SearcherGetConfig = {
    text: string;
    count?: number;
    countOfTrys?: number;
    groupBy?: number;
    page?: number;
    isFamilySearch?: boolean;
    site?: string;
    imageType?: SearcherGetConfigType;
    imageOrient?: SearcherGetConfigOrient;
    imageSize?: SearcherGetConfigSize;
    imageColor?: SearcherGetConfigColor;
};
