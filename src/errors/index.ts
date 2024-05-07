import {ExceptionGenerator} from "./ExceptionGenerator";

// 401 - Unauthorized
export const AuthorizedUserNotFoundException = new ExceptionGenerator(401, 1, 'Авторизированный пользователь не найден');
export const AuthorizedSessionNotFoundException = new ExceptionGenerator(401, 2, 'Авторизированная сессия не найдена. Возможно она истекла или была закрыта');
export const SessionIsNotValidException = new ExceptionGenerator(401, 3, 'Сессия не действительна. AccessToken уже был обновлён ранее');

// 403 - Forbidden
export const IncorrectPasswordException = new ExceptionGenerator(403, 0, 'Неверный пароль');
export const DBWorkException = new ExceptionGenerator(403, 1, 'Ошибка работы базы данных');
export const VKSilentTokenException = new ExceptionGenerator(403, 2, 'Токен был уже использован или недействителен');
export const VKGetUserException = new ExceptionGenerator(403, 3, 'Ошибка получения информации об вк пользователе');
export const IncorrectIDFormatException = new ExceptionGenerator(403, 4, 'Неверный формат ID');
export const FileCreationException = new ExceptionGenerator(403, 5, 'Ошибка создания файла');

// 404 - Not found
export const DeviceIsNotFoundException = new ExceptionGenerator(404, 0, 'Устройство сессии не найдено');
export const SessionNotFoundException = new ExceptionGenerator(404, 1, 'Сессия не найдена');
export const UserNotFoundException = new ExceptionGenerator(404, 2, 'Пользователь не найден');
export const DataNotFoundException = new ExceptionGenerator(404, 3, 'Данные не найдены');
export const GroupNotFoundException = new ExceptionGenerator(404, 4, 'Группа не найдена');
export const GroupArchiveNotFoundException = new ExceptionGenerator(404, 5, 'Запись, в архиве пользователя, о группе, не найдена');
export const GroupRequestNotFoundException = new ExceptionGenerator(404, 6, 'Запрос на вступление в группу, не найден');
export const FileNotFoundException = new ExceptionGenerator(404, 7, 'Запрашиваемый файл не найден');

// 409 - Conflict
export const AccountDataConflictException = new ExceptionGenerator(409, 0, 'Данные уже были использованы в другом аккаунте');
export const GroupArchiveIncludeConflictException = new ExceptionGenerator(409, 1, 'Группа с такими данными, уже находится в архиве');
export const GroupRequestConflictException = new ExceptionGenerator(409, 2, 'Запрос, на присоединение в группу, уже существует. Ожидайте ответа от владельца');
export const GroupIsFullConflictException = new ExceptionGenerator(409, 3, 'Группа уже полная (как ты это сделал?)');
export const UserAlreadyInGroupConflictException = new ExceptionGenerator(409, 3, 'Пользователь уже находится в группе');

// 423 - Locked
export const RoleAccessDividedException = new ExceptionGenerator(423, 0, 'Доступ к данному эндпоинту запрещён!');
export const AccessWithGroupDividedException = new ExceptionGenerator(423, 1, 'Доступ заблокирован! Требуется активная группа');
export const AccessWithoutGroupDividedException = new ExceptionGenerator(423, 2, 'Доступ заблокирован! У вас не должно быть активной группы');
export const ProfileAccessDividedException = new ExceptionGenerator(423, 3, 'Доступ заблокирован! Вы не можете получить доступ к профилю чужого пользователя');
export const AccessWithoutMainRightsInGroupDividedException = new ExceptionGenerator(423, 4, 'Доступ заблокирован! Требуется активная группа и права на главного в группе');

// 520 - Unknown
export const UnknownErrorException = new ExceptionGenerator(520, 0, 'Неизвестная ошибка');
export const SessionDeleteException = new ExceptionGenerator(520, 1, 'Ошибка удаления сессии');
