import { ICulture } from "../../Cultures/models/culture.model";
import { IGeography } from "../../Geography/models/geography.model";
import { IHistory } from "../../History/models/history.model";
import { ILanguage } from "../../Languages/models/language.model";

export interface IWorld {
  languages: ILanguage[];
  cultures: ICulture[];
  geography: IGeography;
  history: IHistory;
}
