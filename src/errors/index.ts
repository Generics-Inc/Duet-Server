import {ExceptionGenerator} from "./ExceptionGenerator";

export * from './ExceptionGenerator';
export * from './GuardianFilter';

// 401 - Unauthorized
export const AuthorizedUserNotFoundException = new ExceptionGenerator(401, 1, 'Авторизированный пользователь не найден');
export const AuthorizedSessionNotFoundException = new ExceptionGenerator(401, 2, 'Авторизированная сессия не найдена. Возможно она истекла или была закрыта');
export const AuthorizedAccountNotFoundException = new ExceptionGenerator(401, 2, 'Не найден подключенный к профилю аккаунт');
export const SessionIsNotValidException = new ExceptionGenerator(401, 4, 'Сессия не действительна. AccessToken уже был обновлён ранее');

// 403 - Forbidden
export const IncorrectPasswordException = new ExceptionGenerator(403, 0, 'Неверный пароль');
export const DBWorkException = new ExceptionGenerator(403, 1, 'Ошибка работы базы данных');
export const VKSilentTokenException = new ExceptionGenerator(403, 2, 'Токен был уже использован или недействителен');
export const VKGetUserException = new ExceptionGenerator(403, 3, 'Ошибка получения информации об вк пользователе');
export const IncorrectIDFormatException = new ExceptionGenerator(403, 4, 'Неверный формат ID');
export const FileCreationException = new ExceptionGenerator(403, 5, 'Ошибка создания файла');
export const FileDeletingException = new ExceptionGenerator(403, 6, 'Ошибка удаления файла');
export const SearcherException = new ExceptionGenerator(403, 7, 'Ошибка поиска информации XML');
export const AccountCreateException = new ExceptionGenerator(403, 8, 'Ошибка создания аккаунта');
export const ParseException = new ExceptionGenerator(403, 9, 'Ошибка парса');

// 404 - Not found
export const DeviceIsNotFoundException = new ExceptionGenerator(404, 0, 'Устройство сессии не найдено');
export const SessionNotFoundException = new ExceptionGenerator(404, 1, 'Сессия не найдена');
export const UserNotFoundException = new ExceptionGenerator(404, 2, 'Пользователь не найден');
export const DataNotFoundException = new ExceptionGenerator(404, 3, 'Данные не найдены');
export const GroupNotFoundException = new ExceptionGenerator(404, 4, 'Группа не найдена');
export const GroupArchiveNotFoundException = new ExceptionGenerator(404, 5, 'Запись, в архиве пользователя, о группе, не найдена');
export const GroupRequestNotFoundException = new ExceptionGenerator(404, 6, 'Запрос на вступление в группу, не найден');
export const FileNotFoundException = new ExceptionGenerator(404, 7, 'Файл не найден');
export const FolderNotFoundException = new ExceptionGenerator(404, 8, 'Папка не найдена');
export const BasketNotFoundException = new ExceptionGenerator(404, 9, 'Контейнер не найден');
export const MovieNotFoundException = new ExceptionGenerator(404, 10, 'Фильм не найден');
export const ProviderResourceNotFoundException = new ExceptionGenerator(404, 11, 'Источник данных не найден у провайдера');
export const MovieTaskNotFoundException = new ExceptionGenerator(404, 12, 'Задача на создание фильма не найдена');
export const MovieSeriaNotFoundException = new ExceptionGenerator(404, 13, 'Серия не найдена');
export const WatchedSeriaNotFoundException = new ExceptionGenerator(404, 14, 'Просмотренная серия не найдена');

// 409 - Conflict
export const AccountDataConflictException = new ExceptionGenerator(409, 0, 'Данные уже были использованы в другом аккаунте');
export const GroupArchiveIncludeConflictException = new ExceptionGenerator(409, 1, 'Группа с такими данными, уже находится в архиве');
export const GroupRequestConflictException = new ExceptionGenerator(409, 2, 'Запрос, на присоединение в группу, уже существует. Ожидайте ответа от владельца');
export const GroupIsFullConflictException = new ExceptionGenerator(409, 3, 'Группа уже полная');
export const UserAlreadyInGroupConflictException = new ExceptionGenerator(409, 4, 'Пользователь уже находится в группе');
export const MovieAlreadyInGroupConflictException = new ExceptionGenerator(409, 5, 'Фильм уже находится в группе');
export const TaskIsAlreadyRunningConflictException = new ExceptionGenerator(409, 6, 'Задача уже запущена и не имеет ошибок');

// 423 - Locked
export const RoleAccessDividedException = new ExceptionGenerator(423, 0, 'Доступ к данному эндпоинту запрещён!');
export const AccessWithGroupDividedException = new ExceptionGenerator(423, 1, 'Доступ заблокирован! Требуется активная группа');
export const AccessWithoutGroupDividedException = new ExceptionGenerator(423, 2, 'Доступ заблокирован! У вас не должно быть активной группы');
export const ProfileAccessDividedException = new ExceptionGenerator(423, 3, 'Доступ заблокирован! Вы не можете получить доступ к профилю чужого пользователя');
export const AccessWithoutMainRightsInGroupDividedException = new ExceptionGenerator(423, 4, 'Доступ заблокирован! Требуется активная группа и права на главного в группе');
export const DirectoryAccessDividedException = new ExceptionGenerator(423, 5, 'Доступ заблокирован! Вы не имеете доступа к этой директории');
export const AccessWithIncompleteDividedException = new ExceptionGenerator(423, 6, 'Доступ заблокирован! Группа должна содержать партнёра');
export const MovieIsNotReadyDividedException = new ExceptionGenerator(423, 7, 'Доступ заблокирован! Фильм не готов, возможно он создан с ошибкой или ещё создаётся');

// 520 - Unknown
export const UnknownErrorException = new ExceptionGenerator(520, 0, 'Неизвестная ошибка');
export const SessionDeleteException = new ExceptionGenerator(520, 1, 'Ошибка удаления сессии');
