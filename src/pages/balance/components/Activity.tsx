import { ICON_SIZE } from "@src/constants/icons";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useToast } from "@src/hooks";
import Extension from "@src/Extension";
import { Loading } from "@src/components/common";
import Record from "@src/storage/entities/activity/Record";
import { RecordData, RecordStatus } from "@src/storage/entities/activity/types";
import { BsArrowUpRight } from "react-icons/bs";
import Contact from "@src/storage/entities/registry/Contact";
import { formatDate } from "@src/utils/utils";
import { CHAINS } from "@src/constants/chains";

export const Activity = () => {
  const { t } = useTranslation("activity");
  const { t: tCommon } = useTranslation("common");
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("" as string);
  const [records, setRecords] = useState([] as Record[]);
  const [contacts, setContacts] = useState([] as Contact[]);
  const { showErrorToast } = useToast();

  useEffect(() => {
    getActivity();
    getContacts();
  }, []);

  const getActivity = async () => {
    try {
      setIsLoading(true);
      const records = await Extension.getActivity();
      setRecords(records);
    } catch (error) {
      setRecords([]);
      showErrorToast(tCommon(error as string));
    } finally {
      setIsLoading(false);
    }
  };

  const getContacts = async () => {
    try {
      setIsLoading(true);
      const contacts = await Extension.getContacts();
      setContacts(contacts);
    } catch (error) {
      setContacts([]);
      showErrorToast(tCommon(error as string));
    } finally {
      setIsLoading(false);
    }
  };

  const getLink = (network: string, hash: string) => {
    const { explorers } =
      CHAINS.flatMap((chainType) => chainType.chains).find(
        (chain) => chain.name.toLowerCase() === network.toLowerCase()
      ) || {};
    const { url } = explorers?.[0] || {};
    return `${url}tx/${hash}`;
  };

  const getContactName = (address: string) => {
    const contact = contacts.find((c) => c.address === address);
    return contact
      ? contact.name
      : address.slice(0, 6) + "..." + address.slice(-4);
  };

  const getValue = (data: RecordData) => {
    if (!data || !data.value) return "$0.0";
    return data.symbol ? `${data.value} ${data.symbol}` : `$${data.value}`;
  };

  const getStatusColor = (status: RecordStatus) => {
    switch (status) {
      case RecordStatus.PENDING:
        return "goldenrod";
      case RecordStatus.SUCCESS:
        return "#469999";
      case RecordStatus.FAIL:
        return "red";
      default:
        return "white";
    }
  };

  if (isLoading) {
    return <Loading />;
  }
  return (
    <>
      <input
        id="search"
        placeholder={t("search") || "Search"}
        className=" border text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white"
        onChange={(e) => {
          setSearch(e.target.value);
        }}
      />

      <div className="flex flex-col my-5 overflow-y-auto max-h-64">
        {records.length === 0 && (
          <div className="flex justify-center items-center mt-5">
            <p className="text-lg font-medium">{t("empty")}</p>
          </div>
        )}
        {records.length > 0 &&
          records
            .filter(({ hash, reference, address }) => {
              return (
                hash.toLowerCase().includes(search.toLowerCase()) ||
                reference.toLowerCase().includes(search.toLowerCase()) ||
                address.toLowerCase().includes(search.toLowerCase())
              );
            })
            .sort((a, b) => b.lastUpdated - a.lastUpdated)
            .map(
              (
                { address, status, lastUpdated, data, network, hash },
                index
              ) => (
                <div
                  key={index}
                  className="mb-5 mr-1 bg-[#343A40] flex rounded-lg py-2 px-4 text-white cursor-pointer items-center gap-3 hover:bg-gray-400 hover:bg-opacity-30 transition"
                >
                  <BsArrowUpRight
                    size={ICON_SIZE}
                    color={getStatusColor(status)}
                  />
                  <div className="overflow-hidden text-ellipsis py-4 px-1">
                    <p className="text-lg">{getContactName(address)}</p>
                    <p>
                      {`${formatDate(lastUpdated)} - `}
                      <a
                        className="text-custom-green-bg hover:text-white"
                        href={getLink(network, hash)}
                      >
                        {tCommon("view_in_scanner")}
                      </a>
                    </p>
                  </div>
                  <div className="text-lg">
                    <p>{getValue(data)}</p>
                    <div className="flex justify-evenly">
                      <div className="w-5 h-5 rounded-full bg-gray-400" />
                      <div className="w-5 h-5 rounded-full bg-gray-400" />
                    </div>
                  </div>
                </div>
              )
            )}
      </div>
    </>
  );
};
